import React, { useId, useMemo } from 'react'
import sanitizeHtml from 'sanitize-html'
export function RenderHtml({ rawHtml }: { rawHtml: string }) {
  const cleanHtml = useMemo(() => {
    return sanitizeHtml(rawHtml)
  }, [rawHtml])
  return (
    <div
      className='whitespace-pre-wrap p-4 text-sm'
      // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitizeHtml is used to clean the html
      dangerouslySetInnerHTML={{
        __html: cleanHtml,
      }}
    />
  )
}
