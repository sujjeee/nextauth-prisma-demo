import { type Metadata } from "next"
import { OAuthSignIn } from '@/components/auth/oauth-signins'
import { SignUpForm } from '@/components/forms/signup-form'
import { InfoAlert } from '@/components/info-alert'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import Link from 'next/link'

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Sign up for an account",
}


export default async function signin() {
    return (
        <div className='flex flex-col h-screen bg-background items-center justify-center'>
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl flex justify-between ">Sign up
                        <InfoAlert />
                    </CardTitle>
                    <CardDescription>
                        Choose your preferred sign up method
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <OAuthSignIn />
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <SignUpForm />
                </CardContent>
                <CardFooter>
                    <div className="text-sm text-muted-foreground">
                        Already have an account? {" "}
                        <Link
                            aria-label="Sign up"
                            href='/signin'
                            className="text-blue-600 font-medium hover:underline underline-offset-4">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
