"use client"
import Link from "next/link";

export default async function Error() {
    return (
        <div className='flex flex-col h-screen bg-background items-center justify-center'>
            <h1 className='text-5xl font-bold'>Something went wrong.</h1>
            <div className='mt-10 text-xl'>
                Please contact us for{ } <Link href={'/'} className='font-bold text-blue-900 hover:underline'>help &rarr;</Link>
            </div>
        </div>
    );
}