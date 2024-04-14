import { ListFeedEntriesResponseType } from '@/lib/api-client'
import { useSearchParams } from 'next/navigation'
import { EntryItem } from './entry-item'

interface EntryListProps {
  items: ListFeedEntriesResponseType
}

export function EntryList({ items }: EntryListProps) {
  const searchParams = useSearchParams()

  const selectedEntryId = searchParams.get('entryId')
  return (
    <div className='flex flex-col gap-2 p-4 pt-0'>
      {/* @ts-ignore */}
      {items.map(item => (
        <EntryItem
          key={item.id}
          item={item}
          selected={item.id === selectedEntryId}
        />
      ))}
    </div>
  )
}
