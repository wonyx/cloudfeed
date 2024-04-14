import { MyFeedScreen } from '@/components/feed/my-feed-screen'
import {
  ListFeedEntriesResponseType,
  client,
  createHeaders,
} from '@/lib/api-client'
import { auth } from '@/lib/auth'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import React from 'react'
export const runtime = 'edge'

export const metadata: Metadata = {
  title: 'My Feed - CloudFeed',
}

export default async function Page({
  searchParams,
}: {
  searchParams: {
    feedId?: string
    entryId?: string
    tab?: string
  }
}) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/api/auth/signin')
  }

  const unread = searchParams.tab === 'unread' ? 'true' : undefined

  const headers = await createHeaders(session)
  const res = await client.api.feeds.$get(
    {
      args: {},
    },
    {
      headers,
    },
  )
  const feeds = await res.json()

  let entries: ListFeedEntriesResponseType = []
  const entriesRes = await client.api.feeds[':id'].entries.$get(
    {
      param: {
        id: searchParams.feedId ?? '-',
      },
      query: {
        unread: unread,
      },
    },
    {
      headers,
    },
  )
  if (entriesRes.ok) {
    entries = await entriesRes.json()
  }

  return <MyFeedScreen feeds={feeds} entries={entries} />
}
