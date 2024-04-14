import { zValidator } from '@hono/zod-validator'
import { eq, inArray, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'
import { db } from '../../infra/db'
import {
  ListFeedEntriesByIdsOutput,
  listFeedEntries,
  listFeedEntriesByIds,
  listFeedEntriesFilter,
} from '../../infra/db/feeds'
import { feed, feedEntry, feedEntryAction } from '../../infra/db/schema'
import { createGenAIClient } from '../../infra/genai'
import { QueryResult } from '../../types/genai'
import { Bindings } from './bindings'
const app = new Hono<{ Bindings: Bindings }>()
export default app
  .get('/', async c => {
    const rows = await db(c.env.DB).select().from(feed)
    return c.json(rows)
  })
  .get(
    '/:id/entries',
    zValidator(
      'param',
      z.object({
        id: z.string(),
      }),
    ),
    zValidator(
      'query',
      z.object({
        unread: z.enum(['true', 'false']).optional(),
      }),
    ),
    async c => {
      console.log(c.req.param('id'), c.req.query().unread)
      let filter: listFeedEntriesFilter = {}
      if (c.req.param('id')) {
        filter = {
          ...filter,
          feedId: c.req.param('id') === '-' ? undefined : c.req.param('id'),
        }
      }
      if (c.req.query().unread === 'true') {
        filter = {
          ...filter,
          unread: true,
        }
      }
      const rows = await listFeedEntries(c.env, { filter })
      // console.log(rows)
      return c.json(rows)
    },
  )
  .patch(
    '/:id/entries/:entryId',
    zValidator(
      'param',
      z.object({
        id: z.string(),
        entryId: z.string(),
      }),
    ),
    zValidator(
      'json',
      z.object({
        read: z.boolean(),
      }),
    ),
    async c => {
      const data = await c.req.json()
      const userId = c.get('userId')
      if (!userId) {
        throw new HTTPException(401, { message: 'No user id' })
      }
      const rows = await db(c.env.DB)
        .insert(feedEntryAction)
        .values({
          userId,
          feedEntryId: c.req.param('entryId'),
          read: data.read,
        })
        .onConflictDoUpdate({
          target: [feedEntryAction.feedEntryId, feedEntryAction.userId],
          set: { read: data.read },
          where: eq(feedEntryAction.feedEntryId, c.req.param('entryId')),
        })
      return c.newResponse('OK', 200)
    },
  )
  .get(
    '/:id/entries/:entryId/similar',
    zValidator(
      'param',
      z.object({
        id: z.string(),
        entryId: z.string(),
      }),
    ),
    async c => {
      const rows = await db(c.env.DB)
        .select()
        .from(feedEntry)
        .where(eq(feedEntry.id, c.req.param('entryId')))
        .limit(1)
      if (rows.length === 0) {
        return c.json([] as ListFeedEntriesByIdsOutput)
      }
      const cli = createGenAIClient(c.env)
      const row = rows[0]
      if (!row.vectors) {
        return c.json([] as ListFeedEntriesByIdsOutput)
      }
      const vectors = JSON.parse(row.vectors as string) as number[][]
      if (vectors.length === 0) {
        return c.json([] as ListFeedEntriesByIdsOutput)
      }
      const topK = 3
      const res = await cli.query(vectors[0], topK, {
        // ignore itself
        id: { $ne: row.id },
        // feedId: { $ne: row.feedId },
      })
      if (!res || res?.count === 0) {
        return c.json([] as ListFeedEntriesByIdsOutput)
      }
      console.debug(res.matches[0])
      const threshold = 0.66
      const ids = res.matches
        .filter(e => e.score > threshold)
        .map(m => {
          return m.metadata?.id!
        })
      if (ids.length === 0) {
        return c.json([] as ListFeedEntriesByIdsOutput)
      }
      const similarEntries = await listFeedEntriesByIds(c.env, ids)
      return c.json(similarEntries)
    },
  )
