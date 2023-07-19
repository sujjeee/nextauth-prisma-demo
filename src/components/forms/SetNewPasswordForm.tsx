"use client"

import * as z from "zod"
import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Icons } from "@/components/icons"
import { PasswordInput } from "@/components/password-input"
import { resetPasswordSchema } from "@/lib/validations/auth"
import { toast } from "sonner"

type Inputs = z.infer<typeof resetPasswordSchema>

export function SetNewPasswordForm({ token }: { token: string }) {

    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false)

    const form = useForm<Inputs>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
            token: token
        },
    });

    async function onSubmit(data: Inputs) {
        try {

            setIsLoading(true)

            const response = await fetch('/api/reset-password', {
                cache: 'no-store',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: data.token,
                    password: data.password
                }),
            });

            if (response.status === 200) {

                const resData = await response.json();
                const email = resData.email;
                const password = data.password

                const res = await signIn("credentials", {
                    email: email,
                    password: password,
                    redirect: false
                });

                if (res?.error !== null) {
                    toast.error("Can't able to login.")
                    setIsLoading(false)
                } else {
                    router.push('/')
                    setIsLoading(false)
                }
            }

        } catch (error) {
            setIsLoading(false)
            toast.error('Something went wrong. Please try again later.');
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel></FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="*********" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel></FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="*********" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading} >
                    {isLoading ? (
                        <>
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </>
                    ) : (
                        "Set password"
                    )}
                </Button>
            </form>
        </Form>
    )
}
