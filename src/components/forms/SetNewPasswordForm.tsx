"use client"

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
import { setNewPasswordSchema } from "@/lib/validations/auth"
import { setNewPasswordType } from "@/types"
import { toast } from "sonner"
import { SetNewPassWordAction } from "@/app/_actions/auth"


export function SetNewPasswordForm({ token }: { token: string }) {

    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false)

    const form = useForm<setNewPasswordType>({
        resolver: zodResolver(setNewPasswordSchema),
        defaultValues: {
            token: token,
            password: "",
            confirmPassword: ""
        },
    });

    async function onSubmit(data: setNewPasswordType) {
        try {

            setIsLoading(true)
            toast.error("DataBase is not connected! Please checkout github repository.");
            setIsLoading(false)

            // const setPasswordResponse = await SetNewPassWordAction(data)

            // if (setPasswordResponse?.success) {

            //     // Sign in the user after successful set new passowrd
            //     const signInResponse = await signIn("credentials", {
            //         email: setPasswordResponse.email,
            //         password: data.password,
            //         redirect: false,
            //     });

            //     if (signInResponse?.error !== null) {
            //         setIsLoading(false)
            //         toast.error(signInResponse?.error || "Unable to login. Please try later.");
            //     } else {
            //         router.refresh()
            //         router.push("/");
            //         setIsLoading(false);
            //     }

            // }

        } catch (error) {
            setIsLoading(false)
            error instanceof Error
                ? toast.error(error.message)
                : toast.error("Something went wrong. Please try again later.");
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
