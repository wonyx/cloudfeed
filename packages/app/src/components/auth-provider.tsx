'use client'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

export function AuthProvider({
  children,
  session,
}: { children: React.ReactNode; session: Session | null }) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}
