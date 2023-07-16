'use client'

import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'

export const Providers = ({ children }: any) => {

    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}