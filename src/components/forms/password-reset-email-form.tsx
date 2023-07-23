"use client"

import * as z from "zod"
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { checkEmailSchema } from "@/lib/validations/auth"
import { toast } from "sonner"
import { emailType } from "@/types";
import { sendEmailAction } from "@/app/_actions/auth"


type PassWordResetEmailFormProps = {
    onEmailFound: (value: string) => void;
};


export function PassWordResetEmailForm(
    { onEmailFound }: PassWordResetEmailFormProps
) {
    const [isLoading, setIsLoading] = React.useState(false)


    const form = useForm<emailType>({
        resolver: zodResolver(checkEmailSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(data: emailType) {
        try {
            setIsLoading(true)
            const email = await sendEmailAction(data)

            if (email.success) {
                onEmailFound(email.emailFound)
                setIsLoading(false)
            }
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="johndoe@example.com" {...field} />
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
                        "Continue"
                    )}
                </Button>
            </form>
        </Form>
    )
}
