'use client'

import * as React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';


export default function ResetDirectLogin({ token }: { token: string }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const router = useRouter();

    React.useEffect(() => {
        const fetchResetData = async () => {
            const response = await fetch('http://localhost:3000/api/verify-login', {
                cache: 'no-store',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                }),
            });

            if (response.status === 200) {
                const data = await response.json();
                const { email } = data;

                const res = await signIn('credentials', {
                    email: email,
                    getLoginToken: token,
                    redirect: false,
                });

                if (res?.error === null) {
                    router.push('/');
                    setIsLoading(false);
                } else {
                    router.push('/signin');
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        fetchResetData();
    }, [token, router]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return null;
}
