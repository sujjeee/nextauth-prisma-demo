import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import { NextResponse } from "next/server";

type RequestBody = {
    token: string;
    password: string;
}

export async function POST(request: Request) {
    try {
        const prisma = new PrismaClient();
        const body: RequestBody = await request.json();

        // Check if all required fields are present in the request body
        if (!body || !body.token || !body.password) {
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

            const salt = await bcrypt.genSalt(10);
            const hashPass = await bcrypt.hash(body?.password, salt);

            const user = await prisma.user.update({
                where: {
                    id: isValidToken.identifier,
                },
                data: {
                    password: hashPass,
                },
            });

            return NextResponse.json({
                message: "New password set successfully!",
                email: user.email
            },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { error: "Access denied" },
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
