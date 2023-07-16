'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { signOut } from 'next-auth/react'
import { Icons } from "@/components/icons"


interface HomePageProps {
    session: any;
}

export const HomePage: React.FC<HomePageProps> = ({ session }) => {

    const [isLoading, setIsLoading] = useState(false)

    const handleSignOut = async () => {
        setIsLoading(true)
        const res = await signOut({ callbackUrl: 'http://localhost:3000/signin' })

        if (res) {
            setIsLoading(false)
        }
    }
    return (
        <>
            <h1 className='text-7xl font-bold'>Hi, { }
                <span className='font-bold text-blue-600'>{session?.user?.name}!</span>
            </h1>
            <div className='mt-10'>
                <Button disabled={isLoading} className='w-full' onClick={handleSignOut}>
                    {isLoading ? (
                        <>
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            Signing out
                        </>
                    ) : (
                        "Sign out"
                    )}
                </Button>
            </div>
        </>
    )
}
