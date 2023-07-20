import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt"

type RequestBody = {
    name: string
    email: string
    password: string
}

export async function POST(request: Request) {
    try {
        const prisma = new PrismaClient();
        const body: RequestBody = await request.json();

        if (!body.name || !body.email || !body.password) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        });

        if (existingUser && existingUser.email === body.email) {
            return NextResponse.json(
                { error: 'That email address is taken. Please try another.' },
                { status: 403 }
            );
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(body.password, salt);

            const newUser = await prisma.user.create({
                data: {
                    name: body.name,
                    email: body.email,
                    password: hashedPassword
                }
            });
            return NextResponse.json({
                success: true,
                message: "Account created successfully.",
                userPayload: newUser
            },
                { status: 201 }
            );
        };

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