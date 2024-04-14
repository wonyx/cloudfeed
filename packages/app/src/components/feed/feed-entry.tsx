'use client'
import format from 'date-fns/format'

import { fetchSimilarEntries, markRead } from '@/actions/feed'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useEffect } from 'react'
import React from 'react'
import { toast } from 'sonner'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { RelatedEntries } from './related-entries'
import { RenderHtml } from './render-html'
import { useRelated } from './use-related'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { ExternalLink, Archive } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FeedEntryType } from '@/lib/api-client'

interface EntryDisplayProps {
  entry?: FeedEntryType
  nextEntry?: FeedEntryType
}

export function EntryDisplay({ entry, nextEntry }: EntryDisplayProps) {
  const [rel, setRel] = useRelated()
  const [relatedItems, setRelatedItems] = React.useState<any[]>([])
  const searchParams = useSearchParams()
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  useEffect(() => {
    if (entry?.feedId && entry.id && rel) {
      console.log('fetching related entries')
      setLoading(true)
      fetchSimilarEntries(entry.feedId, entry.id)
        .then(res => {
          console.log('related entries', res)
          setRelatedItems([...res])
        })
        .catch(err => {
          toast.error('Failed to fetch related entries')
          setRelatedItems([])
        })
        .finally(() => {
          console.log('done fetching related entries')
          setLoading(false)
        })
    }
  }, [entry, rel])
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
  return (
    <div className='flex h-screen flex-col'>
      {entry?.id ? (
        <>
          <div className='flex items-center p-2'>
            <div className=' flex items-center gap-2'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={async () => {
                      if (!entry.id) return
                      await markRead(entry.id, true)
                      nextEntry &&
                        router.push(
                          `/my-feed?${createQueryString({
                            entryId: nextEntry.id,
                          })}`,
                        )
                    }}
                    variant='ghost'
                    size='icon'
                    disabled={!entry}
                  >
                    <>
                      <Archive className='h-4 w-4' />
                      <span className='sr-only'>MARK READ</span>
                    </>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>MARK READ</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon' disabled={!entry} asChild>
                    {entry.link && (
                      <a target='_blank' href={entry.link} rel='noreferrer'>
                        <ExternalLink className='h-4 w-4' />
                        <span className='sr-only'>VISIT WEBSITE</span>
                      </a>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>VISIT WEBSITE</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='flex items-center justify-start ml-4'>
                    <Switch
                      checked={rel}
                      onCheckedChange={(checked: boolean) => {
                        setRel(checked)
                      }}
                    />
                    <Label className='ml-2'>Suggest Related Entries</Label>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Suggest Related Entries</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <Separator />
          <div className='flex items-center justify-between px-4 h-[52px] '>
            <div className='text-md font-bold'>{entry.title}</div>
            {entry.pubDate && (
              <div className='text-xs text-muted-foreground'>
                {format(new Date(entry.pubDate), 'PPpp')}
              </div>
            )}
          </div>
          <Separator />
          <div className='flex h-full flex-col  overflow-y-scroll'>
            {entry.ogImage && (
              <img src={entry.ogImage} alt={entry.title ?? ''} style={{}} />
            )}

            <RenderHtml rawHtml={entry.description as string} />
          </div>
          <Separator className='mt-auto' />
          {rel && (
            <div>
              <Separator />
              <h4 className='px-4 py-2 text-md font-bold'>You Might Like</h4>
              <RelatedEntries entries={relatedItems} loading={loading} />
            </div>
          )}
        </>
      ) : (
        <div className='p-8 text-center text-muted-foreground'>
          No Entry selected
        </div>
      )}
    </div>
  )
}
