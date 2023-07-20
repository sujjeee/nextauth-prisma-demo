import { Prisma, PrismaClient } from "@prisma/client";
import jwt, { Secret } from 'jsonwebtoken';
import { MailtrapClient } from "mailtrap";
import { NextResponse } from "next/server";

type RequestBody = {
    email: string;
}

export async function POST(
    request: Request,
) {
    try {
        const prisma = new PrismaClient();
        const body: RequestBody = await request.json();
        const email = body?.email;

        if (!email) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "This user not exists." },
                { status: 403 }
            );
        }

        // const userEmail = user?.email
        const userPayload = {
            email: user.email,
            password: user.password
        }

        // JwtPrivateKey
        const jwtSPrivateKey: Secret = process.env.JWT_SECRET_KEY as string

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

        // todo:  get host name
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
            return NextResponse.json(
                { error: "Failed to send email." },
                { status: 401 }
            );
        };
        return NextResponse.json({
            emailFound: email,
            token: jwtResetToken
        },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientInitializationError) {
            return NextResponse.json(
                { error: "Database connection error. Please try again later." },
                { status: 409 }
            );
        };

        return NextResponse.json(
            { error: "Internal Server Error. Please try again later." },
            { status: 500 }
        );

    }

}