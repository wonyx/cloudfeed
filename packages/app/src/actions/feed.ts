'use server'

import { client, createHeaders } from '@/lib/api-client'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function fetchSimilarEntries(feedId: string, entryId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/api/auth/signin')
  }

  const headers = await createHeaders(session)
  const similarEntries = await client.api.feeds[':id'].entries[
    ':entryId'
  ].similar.$get(
    {
      param: {
        id: feedId,
        entryId: entryId,
      },
    },
    {
      headers,
    },
  )
  const data = await similarEntries.json()
  console.debug(data)
  return data
}

export async function markRead(entryId: string, read: boolean): Promise<void> {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/api/auth/signin')
  }
  const headers = await createHeaders(session)
  await client.api.feeds[':id'].entries[':entryId'].$patch(
    {
      param: {
        id: '-',
        entryId: entryId,
      },
      json: {
        read: read,
      },
    },
    {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    },
  )
}
