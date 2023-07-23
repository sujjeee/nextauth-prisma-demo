"use client"

import * as React from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
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
import { getSignupAction } from "@/app/_actions/auth";
import { signUpType } from "@/types";


export function SignUpForm() {

    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)

    const form = useForm<signUpType>({
        resolver: zodResolver(authSignupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: signUpType) {
        try {
            setIsLoading(true);

            const signUp = await getSignupAction(data)

            if (signUp.success) {

                // Sign in the user after successful registration
                const signInResponse = await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                });

                if (signInResponse?.error !== null) {
                    setIsLoading(false)
                    toast.error(signInResponse?.error || "Unable to login. Please try later.");
                } else {
                    router.refresh();
                    router.push("/");
                    setIsLoading(false);
                }

            } else {
                setIsLoading(false)
                toast.error("Something went wrong. Please try again later.");
            }

        } catch (error) {
            setIsLoading(false)
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("Something went wrong. Please try again later.");
            }

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