import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"

interface RequestBody {
    name: string
    email: string
    password: string
}

export async function POST(request: Request) {
    try {

        const prisma = new PrismaClient();
        const body: RequestBody = await request.json();

        const existingUser = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        })

        if (existingUser && existingUser.email === body.email) {
            return new Response("That email address is taken. Please try another", { status: 403 });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(body.password, salt);

            const newUser = await prisma.user.create({
                data: {
                    name: body.name,
                    email: body.email,
                    password: hashedPassword
                }
            })
            return new Response(JSON.stringify(newUser), { status: 201 });
        }

    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 });
    }

}