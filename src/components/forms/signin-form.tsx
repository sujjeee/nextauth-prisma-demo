"use client"

import { useState } from "react"
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
import { authSigninSchema } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Icons } from "@/components/icons"


type Inputs = z.infer<typeof authSigninSchema>


export function SignInForm() {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<Inputs>({
        resolver: zodResolver(authSigninSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: Inputs) {
        try {
            setIsLoading(true)

            const signInResponse = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            })

            if (signInResponse?.error !== null) {
                setIsLoading(false)
                toast.error('Invalid Credentials.')
            } else {
                setIsLoading(false)
                router.refresh();
                router.push('/')
            }

        } catch (error) {
            setIsLoading(false)
            toast.error("Something went wrong. Please try again later.")
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