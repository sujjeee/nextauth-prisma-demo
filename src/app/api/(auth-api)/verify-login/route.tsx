import { PrismaClient } from "@prisma/client";
import jwt, { Secret } from "jsonwebtoken";

interface RequestBody {
    token: string;
}

export async function POST(request: Request) {
    try {
        const prisma = new PrismaClient();
        const body: RequestBody = await request.json();

        if (!body || !body.token) {
            return new Response("Missing required fields", { status: 403 });
        }

        const isValidToken = await prisma.verificationToken.findFirst({
            where: {
                token: body.token,
            },
        });

        if (
            isValidToken &&
            isValidToken.token === body.token
        ) {
            // verify jwt token
            const jwtSPrivateKey: Secret = process.env.JWT_SECRET_KEY as string
            const jwtResetToken = jwt.verify(body.token, jwtSPrivateKey)

            if (jwtResetToken) {
                await prisma.user.update({
                    where: {
                        id: isValidToken.identifier,
                    },
                    data: {
                        signatureToken: isValidToken.token,
                    },
                });

                return new Response(
                    JSON.stringify({
                        email: isValidToken.email
                    }),
                    { status: 200 }
                );
            }
        }
        else {
            return new Response("Access denied", { status: 404 });
        }
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

