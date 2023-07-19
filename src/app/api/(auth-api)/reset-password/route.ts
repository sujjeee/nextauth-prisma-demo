import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"

interface RequestBody {
    token: string;
    password: string;
}

export async function POST(request: Request): Promise<Response> {
    try {
        const prisma = new PrismaClient();
        const body: RequestBody = await request.json();

        // Check if all required fields are present in the request body
        if (!body || !body.token || !body.password) {
            return new Response("Missing required fields", { status: 400 });
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

            const salt = await bcrypt.genSalt(10);
            const hashPass = await bcrypt.hash(body?.password, salt);

            const res = await prisma.user.update({
                where: {
                    id: isValidToken.identifier,
                },
                data: {
                    password: hashPass,
                },
            });

            return new Response(
                JSON.stringify({
                    message: "New password set successfully!",
                    email: res.email,
                }),
                { status: 200 }
            );
        } else {
            return new Response("Access denied", { status: 404 });
        }
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
