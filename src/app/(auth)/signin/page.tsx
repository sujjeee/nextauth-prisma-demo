import { OAuthSignIn } from '@/components/auth/oauth-signins'
import { SignInForm } from '@/components/forms/signin-form'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import Link from 'next/link'
import { InfoAlert } from '@/components/info-alert'


export default async function signin() {

    return (
        <div className='flex flex-col h-screen bg-background items-center justify-center'>
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl flex justify-between ">Sign in
                        <InfoAlert />
                    </CardTitle>
                    <CardDescription>
                        Choose your preferred sign in method
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
                    <SignInForm />
                </CardContent>
                <CardFooter className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm text-muted-foreground">
                        <span className="mr-1 hidden sm:inline-block">
                            Don&apos;t have an account?
                        </span>
                        <Link
                            aria-label="Sign up"
                            href='/signup'
                            className="text-blue-600 font-medium hover:underline underline-offset-4">
                            Sign up
                        </Link>
                    </div>
                    <Link
                        aria-label="Reset password"
                        href="/account/password/reset"
                        className="text-blue-600 font-medium hover:underline underline-offset-4 text-sm"
                    >
                        Forgot password?
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
