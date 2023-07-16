'use client'
import Link from "next/link";

export default async function NotFound() {
    return (
        <div className='flex flex-col h-screen bg-background items-center justify-center'>
            <h1 className='text-5xl font-bold'>Uh oh! Page not found.</h1>
            <div className='mt-10 text-xl'>
                Go back { } <Link href={'/'} className='font-bold text-blue-900 hover:underline'>Home &rarr;</Link>
            </div>
        </div>
    );
}