import { redirect } from 'next/navigation'
import { HomePage } from '@/components/layout/HomePage'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'


export default async function Home() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/signin");

  if (session) {
    return (
      <div className='flex flex-col h-screen bg-background items-center justify-center'>
        <HomePage session={session} />
      </div>
    );
  }
}
