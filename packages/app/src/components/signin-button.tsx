'use client'
import { signIn } from 'next-auth/react'
import React from 'react'
import { Button } from './ui/button'

export function SigninButton({ children }: { children: React.ReactNode }) {
  return (
    <Button
      onClick={() =>
        signIn('github', {
          callbackUrl: '/my-feed',
          redirect: true,
        })
      }
    >
      {children}
    </Button>
  )
}
