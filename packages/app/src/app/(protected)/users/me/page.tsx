import { UserCard } from '@/components/user/user-card'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Page() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/api/auth/signin')
  }
  return (
    <div className='flex justify-center items-center h-full'>
      <UserCard user={session.user} />
    </div>
  )
}
export const runtime = 'edge'
