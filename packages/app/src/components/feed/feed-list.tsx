'use client'

import { Rss } from 'lucide-react'
import * as React from 'react'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TooltipProvider } from '@/components/ui/tooltip'

import {
  ListFeedEntriesResponseType,
  ListFeedsResponseType,
} from '@/lib/api-client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { UserNav } from '../user-nav'
import { EntryDisplay } from './feed-entry'
import { EntryList } from './feed-entry-list'
import { Nav } from './nav'

interface FeedListProps {
  feeds: ListFeedsResponseType
  entries: ListFeedEntriesResponseType
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
}

export function FeedList({
  feeds,
  entries,
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: FeedListProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const searchParams = useSearchParams()
  const variant = 'ghost' as const
  // @ts-ignore
  const links = feeds.map(item => ({
    type: 'feed' as const,
    feedId: item.id ?? '',
    title: item.title ?? '',
    icon: Rss,
    variant,
  }))

  const [entry, nextEntry] = React.useMemo(() => {
    const entryId = searchParams.get('entryId')
    let entry = null
    let i = 0
    for (; i < entries.length; i++) {
      if (entries[i].id === entryId) {
        entry = entries[i]
        break
      }
      // @ts-ignore
    }
    return [entry, i < entries.length ? entries[i + 1] : null]
  }, [entries, searchParams])
  const selectedFeed = React.useMemo(() => {
    const feedId = searchParams.get('feedId')
    // @ts-ignore
    return feeds.find(feed => feed.id === feedId)
  }, [feeds, searchParams])
  const createQueryString = React.useCallback(
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
  const tab = searchParams.get('tab') ?? 'all'

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction='horizontal'
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes,
          )}`
        }}
        className='h-full max-h-screen items-stretch'
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          className={cn(
            isCollapsed &&
              'min-w-[50px] transition-all duration-300 ease-in-out',
          )}
        >
          <div className='flex flex-col justify-between h-screen'>
            <div className='grow'>
              <div
                className={cn(
                  'flex h-[52px] items-center justify-between',
                  isCollapsed ? 'h-[52px]' : 'px-2',
                )}
              >
                <h1 className='text-xl font-bold'>CloudFeed</h1>
              </div>
              <Separator />
              <Nav isCollapsed={isCollapsed} links={links} />
            </div>
            <Separator />
            <div className='min-h-[52px] w-full py-2 px-2 shrink'>
              <UserNav />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue='all' value={tab}>
            <div className='flex flex-col h-screen'>
              <div className='flex-none flex items-center px-4 py-2'>
                <h2 className='text-xl font-bold'>
                  {selectedFeed ? selectedFeed.title : 'All'}
                </h2>
                <TabsList className='ml-auto'>
                  <TabsTrigger
                    value='all'
                    className='text-zinc-600 dark:text-zinc-200'
                    asChild
                  >
                    <Link
                      href={`/my-feed?${createQueryString({
                        tab: null,
                      })}`}
                    >
                      All
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger
                    value='unread'
                    className='text-zinc-600 dark:text-zinc-200'
                    asChild
                  >
                    <Link
                      href={`/my-feed?${createQueryString({
                        tab: 'unread',
                      })}`}
                    >
                      Unread
                    </Link>
                  </TabsTrigger>
                </TabsList>
              </div>
              <Separator />

              <TabsContent value={tab} className='overflow-y-auto'>
                <EntryList items={entries} />
              </TabsContent>
            </div>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <EntryDisplay
            entry={entry ?? undefined}
            nextEntry={nextEntry ?? undefined}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
