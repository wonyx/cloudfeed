'use client'
import { FeedEntryType } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { formatDistanceToNow, parseISO } from 'date-fns'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useCallback } from 'react'

export function EntryItem({
  item,
  selected,
  displayFeedTitle,
  feedId,
}: {
  item: FeedEntryType
  selected?: boolean
  displayFeedTitle?: boolean
  feedId?: string
}) {
  const searchParams = useSearchParams()
  const createQueryString = useCallback(
    (kv: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const k in kv) {
        const val = kv[k]
        if (val !== null) {
          params.set(k, val)
        } else {
          params.delete(k)
        }
      }
      return params.toString()
    },
    [searchParams],
  )
  const queryStringArgs: Record<string, string | null> = {
    entryId: item.id,
  }
  if (feedId) {
    queryStringArgs.feedId = feedId
    queryStringArgs.view = null
  }
  return (
    <>
      <Link
        key={item.id}
        className={cn(
          'flex flex-col items-start gap-2 rounded-lg border  p-3 text-left text-sm transition-all hover:bg-accent',
          selected && 'bg-muted border-primary',
        )}
        href={`/my-feed?${createQueryString(queryStringArgs)} `}
      >
        <div className='flex w-full flex-col gap-1'>
          {displayFeedTitle && (
            <p className='text-md text-muted-foreground'>{item.feedTitle}</p>
          )}
          <div className='flex items-center'>
            <div className='font-semibold'>{item.title}</div>
          </div>
          <div
            className={cn(
              'ml-auto text-xs',
              selected ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {formatDistanceToNow(parseISO(item.pubDate ?? ''), {
              addSuffix: true,
            })}
          </div>
        </div>
      </Link>
    </>
  )
}
