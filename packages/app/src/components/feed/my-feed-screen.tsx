import {
  ListFeedEntriesResponseType,
  ListFeedsResponseType,
} from '@/lib/api-client'
import React from 'react'
import { FeedList } from './feed-list'

export function MyFeedScreen(props: {
  feeds: ListFeedsResponseType
  entries: ListFeedEntriesResponseType
}) {
  return (
    <FeedList
      feeds={props.feeds}
      entries={props.entries}
      defaultLayout={undefined}
      navCollapsedSize={0}
    />
  )
}
