import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { EntryItem } from './entry-item'

export function RelatedEntries({
  entries,
  loading,
}: { entries: any[]; loading?: boolean }) {
  return (
    <>
      {loading ? (
        <Skelton />
      ) : entries.length === 0 ? (
        <NotFound />
      ) : (
        <div className='w-full grid grid-cols-3 gap-4 p-4'>
          {entries?.map(entry => (
            <EntryItem
              key={entry.id}
              item={entry}
              selected={false}
              displayFeedTitle={true}
              feedId={entry.feedId}
            />
          ))}
        </div>
      )}
    </>
  )
}
function Skelton() {
  return (
    <div className='w-full grid grid-cols-3 gap-4 p-4'>
      <div className='flex items-center space-x-4'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-[250px]' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
    </div>
  )
}
function NotFound() {
  return (
    <div className='w-full grid grid-cols-3 gap-4 p-4'>
      <div className='flex items-center space-x-4'>
        <div className='space-y-2'>
          <p>No related entries found</p>
        </div>
      </div>
    </div>
  )
}
