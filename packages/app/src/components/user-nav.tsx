'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export function UserNav() {
  const { data: session } = useSession()
  const user = session?.user
  if (!user) {
    redirect('/api/auth/signin')
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuItem className='font-normal' asChild>
          <Link href='/users/me'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm font-medium leading-none'>{user.name}</p>
              <p className='text-xs leading-none text-muted-foreground'>
                {user.email}
              </p>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOut({ callbackUrl: '/' })
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
