"use client"

import { type Metadata } from "next"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { PassWordResetEmailForm } from "@/components/forms/password-reset-email-form"
import * as React from "react"

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Enter your email to reset your password",
}

export default function ForgotPage() {

    const [isEmailFound, setIsEmailFound] = React.useState<string | null>(null)

    function handleEmailFound(value: string) {
        return setIsEmailFound(value);
    }

    return (
        <div className='flex flex-col h-screen bg-background items-center justify-center'>
            {!isEmailFound ? (
                <Card>
                    <CardHeader className="space-y-3">
                        <CardTitle className="text-2xl">Trouble logging in?</CardTitle>
                        <CardDescription>
                            Enter your email address and we'll send you a link to get back into your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <PassWordResetEmailForm onEmailFound={handleEmailFound} />
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader className="space-y-3">
                        <CardTitle className="text-2xl">Email Sent</CardTitle>
                        <CardDescription>
                            We sent an email to <span className="text-black font-semibold">{isEmailFound}</span> with a link to get back into your account.
                        </CardDescription>
                    </CardHeader>
                </Card>
            )}
        </div>
    )
}