import { PrismaClient } from "@prisma/client";
import jwt, { Secret } from 'jsonwebtoken';
import { MailtrapClient } from "mailtrap";

export async function POST(
    request: Request,
) {
    try {
        const prisma = new PrismaClient();
        const body = await request.json();
        const email = body?.email;

        if (!email) {
            return new Response("Missing required fields", { status: 403 });
        }

        const isUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        const userEmail = isUser?.email

        if (isUser?.email === email) {
            const userPayload = {
                email: isUser?.email,
                password: isUser?.password
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
                        identifier: isUser?.id || "",
                        email: isUser?.email || "",
                        token: jwtResetToken,
                        expires: expirationTime
                    },
                });
            } else {
                await prisma.verificationToken.create({
                    data: {
                        identifier: isUser?.id || "",
                        email: isUser?.email || "",
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
                    email: userEmail ?? "",
                }
            ];

            const isEmailSent = await client.send({
                from: sender,
                to: recipients,
                template_uuid: process.env.MAILTRAP_TEMPLATE_UUID as string,
                template_variables: {
                    "user_email": `${userEmail}`,
                    "login_link": `${hostName}/account/reset-login?token=${jwtResetToken}`,
                    "pass_reset_link": `${hostName}/account/password/reset/confirm?token=${jwtResetToken}`
                }
            });

            if (!isEmailSent.success) {
                return new Response("Email failed", { status: 401 });
            };

            return new Response(JSON.stringify({
                emailFound: email,
                token: jwtResetToken
            }), { status: 200 });

        } else {
            return new Response("User not found.", { status: 403 });
        }
    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }

}