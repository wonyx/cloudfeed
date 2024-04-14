import { Loader2 } from 'lucide-react'
import React from 'react'
import { Button, ButtonProps } from './ui/button'

export interface ActionButtonProps extends ButtonProps {
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}
export function ActionButton(props: ActionButtonProps) {
  const { children, icon, loading, ...rest } = props
  return (
    <Button disabled={loading} {...rest}>
      {loading ? (
        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
      ) : icon ? (
        icon
      ) : (
        <></>
      )}
      {children}
    </Button>
  )
}
