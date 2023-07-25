"use server"

import { PrismaClient } from "@prisma/client";
import {
    emailType,
    setNewPasswordType,
    signUpType
} from "@/types";
import jwt, { Secret } from "jsonwebtoken";
import { MailtrapClient } from "mailtrap";
import { hashPassword } from "@/lib/passwordSecurity"
const prisma = new PrismaClient();
const jwtSPrivateKey: Secret = process.env.JWT_SECRET_KEY as string

// Signup Server Action
export async function getSignupAction(params: signUpType) {

    const { name, email, password } = params

    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (existingUser && existingUser.email === email) {
        throw new Error("That email address is taken. Please try another.")
    }

    const hashedPassword = await hashPassword(password)

    const newUser = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword
        }
    });

    return { success: true, newUser }
}

// Email Server Action
export async function sendEmailAction(params: emailType) {

    const { email } = params

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (!user) {
        throw new Error("Invalid Credentials.")
    }

    const userPayload = {
        email: user.email,
        password: user.password
    }

    // Generating JWT token
    const jwtResetToken = jwt.sign(userPayload, jwtSPrivateKey)

    // Set up expiration time
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 10);

    const existingUserVerificationToken = await prisma.verificationToken.findFirst({
        where: {
            email: email
        }
    })

    if (existingUserVerificationToken) {
        await prisma.verificationToken.update({
            where: {
                id: existingUserVerificationToken.id,
            },
            data: {
                identifier: user.id,
                email: user.email,
                token: jwtResetToken,
                expires: expirationTime
            },
        });
    } else {
        await prisma.verificationToken.create({
            data: {
                identifier: user.id,
                email: user.email,
                token: jwtResetToken,
                expires: expirationTime
            },
        });
    }

    const hostName = process.env.NEXTAUTH_URL
    const TOKEN = process.env.MAILTRAP_TOKEN as string;
    const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

    const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

    const sender = {
        email: process.env.MAILTRAP_SENDER_EMAIL as string,
        name: process.env.MAILTRAP_SENDER_NAME as string,
    };

    const recipients = [
        {
            email: user.email,
        }
    ];

    const isEmailSent = await client.send({
        from: sender,
        to: recipients,
        template_uuid: process.env.MAILTRAP_TEMPLATE_UUID as string,
        template_variables: {
            "user_email": `${user.email}`,
            "login_link": `${hostName}/account/reset-login?token=${jwtResetToken}`,
            "pass_reset_link": `${hostName}/account/password/reset/confirm?token=${jwtResetToken}`
        }
    });

    if (!isEmailSent.success) {
        throw new Error("Failed to send email. Please try again later")
    };

    return {
        success: true,
        emailFound: email,
        // token: jwtResetToken
    }
}

// passwordless login action 
export async function getLoginAction(params: string) {

    const token = params

    const isValidToken = await prisma.verificationToken.findFirst({
        where: {
            token,
        },
    });

    if (!isValidToken) {
        throw new Error("Invalid token or expired.")
    }

    if (isValidToken && isValidToken.expires > new Date()) {

        // verify jwt token
        const jwtResetToken = jwt.verify(token, jwtSPrivateKey)

        if (jwtResetToken) {
            await prisma.user.update({
                where: {
                    id: isValidToken.identifier,
                },
                data: {
                    signatureToken: isValidToken.token,
                },
            });

        }
        return {
            success: true,
            email: isValidToken.email
        }
    }
}

// Set new password action
export async function SetNewPassWordAction(params: setNewPasswordType) {
    const { token, password } = params

    const isValidToken = await prisma.verificationToken.findFirst({
        where: {
            token,
        },
    });

    if (!isValidToken) {
        throw new Error("Invalid token or expired.")
    }

    if (isValidToken && isValidToken.expires > new Date()) {

        const hashedPassword = await hashPassword(password)

        const user = await prisma.user.update({
            where: {
                id: isValidToken.identifier,
            },
            data: {
                password: hashedPassword,
            },
        });

        return {
            success: true,
            email: user.email
        }

    }
}