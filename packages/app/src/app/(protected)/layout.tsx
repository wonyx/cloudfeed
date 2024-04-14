import { AuthProvider } from '@/components/auth-provider'
import { auth } from '@/lib/auth'
import React from 'react'
export default async function Layout({
  children,
}: { children: React.ReactNode }) {
  const session = await auth()
  return <AuthProvider session={session}>{children}</AuthProvider>
}
