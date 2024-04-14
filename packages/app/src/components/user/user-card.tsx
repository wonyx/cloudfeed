import { User } from 'next-auth'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { DeleteUserAlertDialog } from './delete-user-alert-dialog'

export function UserCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent className='space-y-2'>
        <div className='flex items-center space-x-4'>
          <Avatar>
            <AvatarImage src={user.image ?? ''} />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className='text-sm font-medium leading-none'>{user.name}</p>
            <p className='text-sm text-muted-foreground'>{user.email}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <DeleteUserAlertDialog />
      </CardFooter>
    </Card>
  )
}
