import { type Metadata } from "next"

import { PrismaClient } from "@prisma/client";
import ResetDirectLogin from "@/components/forms/reset-direct-login";
import NotFound from "../not-found";


export const metadata: Metadata = {
    title: "Verifing Login credentials",
}


export default async function SetPasswordPage({ searchParams }: any) {
    const prisma = new PrismaClient();
    const { token } = searchParams
    // get token query
    if (!token) {
        return (
            <NotFound />
        )
    }

    // Verify the token form database 
    const isValidToken = await prisma.verificationToken.findUnique({
        where: {
            token: token,
        },
    });

    if (!isValidToken || isValidToken.expires > new Date()) {
        return (
            <ResetDirectLogin token={token} />
        );
    } else {
        return <NotFound />;
    }
}