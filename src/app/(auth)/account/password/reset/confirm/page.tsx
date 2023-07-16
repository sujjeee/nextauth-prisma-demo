import { type Metadata } from "next"
import { PrismaClient } from "@prisma/client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { SetNewPasswordForm } from "@/components/forms/SetNewPasswordForm";
import NotFound from "../../../not-found";


export const metadata: Metadata = {
    title: "Set new password",
    description: "Set new password for your account",
}


export default async function SetPassword({ searchParams }: any) {

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


    if (isValidToken && isValidToken.expires > new Date()) {
        return (
            <div className='flex flex-col h-screen bg-background items-center justify-center'>
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl">Set new password</CardTitle>
                        <CardDescription>
                            Enter your completely new password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <SetNewPasswordForm token={token} />
                    </CardContent>
                </Card>
            </div>
        );
    } else {
        return <NotFound />;
    }
}