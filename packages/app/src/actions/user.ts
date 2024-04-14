'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteAccount() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  const res = await db()
    .delete(users)
    .where(eq(users.id, session.user.id))
    .execute()
  if (res.error) {
    throw new Error(res.error)
  }
  revalidatePath('/users/me')
  redirect('/')
}
