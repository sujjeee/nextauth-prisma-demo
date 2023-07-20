import { Prisma, PrismaClient } from "@prisma/client";
import jwt, { Secret } from "jsonwebtoken";
import { NextResponse } from "next/server";

type RequestBody = {
    token: string;
}

export async function POST(request: Request) {
    try {
        const prisma = new PrismaClient();
        const body: RequestBody = await request.json();

        if (!body.token) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        const isValidToken = await prisma.verificationToken.findFirst({
            where: {
                token: body.token,
            },
        });

        if (isValidToken && isValidToken.token === body.token) {
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
                return NextResponse.json(
                    { email: isValidToken.email },
                    { status: 200 }
                );
            }
        }
        else {
            return NextResponse.json(
                { error: "auntherize access" },
                { status: 403 }
            );
        }
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

