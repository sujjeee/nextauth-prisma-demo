import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { compare } from "bcrypt";
import { comparePassword } from "@/lib/passwordSecurity";

type RequestBody = {
    email: string;
    password: string;
}

export async function POST(request: NextRequest) {
    try {
        const prisma = new PrismaClient();
        const body: RequestBody = await request.json();

        if (!body.email || !body.password) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        const isAdmin = await prisma.user.findUnique({
            where: {
                email: body.email,
                admin: true
            },
        });

        if (!isAdmin) {
            return NextResponse.json(
                { error: "Unauthorized access!" },
                { status: 403 }
            );
        }

        const adminConfirm = await comparePassword({
            userPassword: body.password,
            dbPassword: isAdmin.password ?? "",
        });

        if (adminConfirm) {
            await prisma.user.deleteMany({
                where: {
                    NOT: {
                        id: isAdmin.id,
                    },
                },
            });
            await prisma.verificationToken.deleteMany();
            await prisma.account.deleteMany();
            await prisma.session.deleteMany();
            return NextResponse.json(
                { message: "Database cleared successfully." },
                { status: 200 }
            );
        }

    } catch (error) {
        console.log(error)
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

