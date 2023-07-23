"use client"

import * as React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import { getLoginAction } from '@/app/_actions/auth';
import NotFound from "@/app/(auth)/account/not-found"


export default function ResetDirectLogin({ token }: { token: string }) {

    const [isLoading, setIsLoading] = React.useState(true);
    const router = useRouter();

    React.useEffect(() => {
        const fetchResetData = async () => {
            try {
                const directLoginResponse = await getLoginAction(token)

                if (directLoginResponse?.success) {

                    const signInResponse = await signIn('credentials', {
                        email: directLoginResponse.email,
                        getLoginToken: token,
                        redirect: false,
                    });

                    if (signInResponse?.error === null) {
                        router.push('/');
                        setIsLoading(false);
                    }
                }
            } catch (error) {
                setIsLoading(false);
                console.error(error)
            }
        };

        fetchResetData();
    }, [token, router]);

    if (isLoading) {
        return <Loading />;
    }

    return <NotFound />;
}
