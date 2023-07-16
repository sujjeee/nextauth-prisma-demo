import { type Metadata } from "next"

import { PrismaClient } from "@prisma/client";
import ResetDirectLogin from "@/components/forms/reset-direct-login";


export const metadata: Metadata = {
    title: "Verifing Login credentials",
}


export default async function SetPasswordPage({ searchParams }: any) {
    const prisma = new PrismaClient();

    // Take token query form url
    const { token } = searchParams

    if (!token) {
        return (
            <p>Invalid Token</p>
        )
    }

    // Verify the token form database 
    const isValidToken = await prisma.verificationToken.findFirst({
        where: {
            token: token,
        },
    });


    if (isValidToken && isValidToken.expires > new Date()) {
        return (
            <ResetDirectLogin token={token} />
        );
    } else {
        return <p>Page not found.</p>;
    }
}