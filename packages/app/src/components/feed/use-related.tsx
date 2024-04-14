'use client'
import React, { useEffect } from 'react'

export function useRelated(): [boolean, (b: boolean) => void] {
  const [useRelated, setUseRelated] = React.useState('false' as string)
  useEffect(() => {
    setUseRelated(window.localStorage.getItem('use-related') ? 'true' : 'false')
  }, [])
  return [
    useRelated === 'true' ? true : false,
    (b: boolean) => {
      const val = b ? 'true' : 'false'
      window.localStorage.setItem('use-related', val)
      setUseRelated(val)
    },
  ]
}
