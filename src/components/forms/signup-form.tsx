"use client"

import * as React from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import type { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { PasswordInput } from "../password-input"
import { authSignupSchema } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Icons } from "@/components/icons"

type Inputs = z.infer<typeof authSignupSchema>


export function SignUpForm() {

    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)

    const form = useForm<Inputs>({
        resolver: zodResolver(authSignupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: Inputs) {
        try {

            setIsLoading(true);

            const signUpResponse = await fetch("/api/signup", {
                cache: 'no-store',
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    name: data.name,
                    password: data.password
                }),
            });

            console.log('checking response', signUpResponse.json())
            if (signUpResponse.ok) {

                // Sign in the user after successful registration
                const signInResponse = await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                });

                if (signInResponse?.error !== null) {
                    setIsLoading(false)
                    toast.error("Unable to login.");
                } else {
                    router.push("/");
                    setIsLoading(false);
                }

            } else {
                setIsLoading(false)
                toast.error('That email address is taken. Please try another.')
            }

        } catch (error) {
            setIsLoading(false)
            toast.error('Uh oh! Something went wrong.')
        }
    }

    return (
        <Form {...form}>
            <form
                className="grid gap-4"
                onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="johndoe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="*******" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={isLoading} className="w-full" type='submit'>
                    {isLoading ? (
                        <>
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </>
                    ) : (
                        "Log In"
                    )}
                </Button>
            </form>
        </Form>
    )
}