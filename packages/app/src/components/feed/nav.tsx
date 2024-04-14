'use client'

import { Home, LucideIcon } from 'lucide-react'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import React from 'react'

interface NavProps {
  isCollapsed: boolean
  links: {
    type: 'feed' | 'all'
    feedId?: string
    title: string
    icon: LucideIcon
    variant: 'default' | 'ghost'
  }[]
}

export function Nav({ links, isCollapsed }: NavProps) {
  const searchParams = useSearchParams()
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams],
  )
  const navItems = React.useMemo(
    () => [
      {
        type: 'all',
        title: 'All',
        feedId: '',
        icon: Home,
        variant:
          !searchParams.get('view') && !searchParams.get('feedId')
            ? ('default' as const)
            : ('ghost' as const),
      },
      ...links.map(link => ({
        ...link,
        variant:
          searchParams.get('feedId') === link.feedId
            ? ('default' as const)
            : ('ghost' as const),
      })),
    ],
    [links, searchParams],
  )
  return (
    <div
      data-collapsed={isCollapsed}
      className='group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2'
    >
      <nav className='grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
        {navItems.map((link, index) => {
          switch (link.type) {
            case 'all':
              return (
                <Link
                  key={index}
                  href='/my-feed'
                  className={cn(
                    buttonVariants({ variant: link.variant, size: 'sm' }),
                    link.variant === 'default' &&
                      'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
                    'justify-start',
                  )}
                >
                  <link.icon className='mr-2 h-4 w-4' />
                  {link.title}
                </Link>
              )
            default:
              return (
                <Link
                  key={index}
                  href={`/my-feed?feedId=${link.feedId!}`}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: 'sm' }),
                    link.variant === 'default' &&
                      'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
                    'justify-start',
                  )}
                >
                  <link.icon className='mr-2 h-4 w-4' />
                  {link.title}
                </Link>
              )
          }
        })}
      </nav>
    </div>
  )
}
