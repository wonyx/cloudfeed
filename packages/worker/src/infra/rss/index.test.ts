import { readFileSync } from 'node:fs'
import { SpyInstance, describe, expect, it, vi } from 'vitest'
import { createRSSClient } from '.'

describe('createRSSClient', () => {
  let mockedFetch: SpyInstance

  it('fetchEntryMetadata', async () => {
    mockedFetch = vi.spyOn(global, 'fetch').mockImplementation(async () => {
      console.log(__dirname)
      const payload = readFileSync(`${__dirname}/og.html`)
      return new Response(payload, { status: 200 })
    })
    const cli = createRSSClient()
    const meta = await cli.fetchEntryMetadata({
      url: 'http://placeholder.test/og.html',
    })
    expect(meta).toEqual({ ogImage: 'https://test.com/og-image' })
  })
})
