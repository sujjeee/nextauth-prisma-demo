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


type Inputs = z.infer<typeof checkEmailSchema>

type PassWordResetEmailFormProps = {
    onEmailFound: (value: string) => void;
};


export function PassWordResetEmailForm(
    { onEmailFound }: PassWordResetEmailFormProps
) {
    const [isLoading, setIsLoading] = React.useState(false)


    const form = useForm<Inputs>({
        resolver: zodResolver(checkEmailSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(data: Inputs) {
        try {
            setIsLoading(true)

            const emailVerifyResponse = await fetch('/api/verify-email/', {
                cache: 'no-store',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: data.email })
            });

            if (emailVerifyResponse.status === 200) {

                const data = await emailVerifyResponse.json();
                const getEmailValue = data.emailFound;

                // send email to parent component after verify 
                onEmailFound(getEmailValue)
                setIsLoading(false)
            } else {
                setIsLoading(false)
                toast.error('Invalid Credentials.')
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
