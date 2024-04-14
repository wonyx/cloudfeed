import * as cheerio from 'cheerio'
import { eq, inArray, sql } from 'drizzle-orm'
import _ from 'lodash'
import sanitizeHtml from 'sanitize-html'
import { db } from '../../infra/db'
import { feed, feedEntry } from '../../infra/db/schema'
import { createGenAIClient } from '../../infra/genai'
import { createRSSClient } from '../../infra/rss'
import { Env } from '../../types'
import {
  ProcessFeedEntryPayload,
  SyncFeedsChunkPayload,
  SyncFeedsPayload,
} from '../../types/queue'

interface JobClient {
  syncFeeds(payload: SyncFeedsPayload): Promise<void>
  syncFeedByChunk(payload: SyncFeedsChunkPayload): Promise<void>
  processFeedEntry(payload: ProcessFeedEntryPayload): Promise<void>
}

const syncFeedsChunkSize = 5

export function createJobClient(env: Env): JobClient {
  const d1 = db(env.DB)
  return {
    async syncFeeds(): Promise<void> {
      const feedAll = await db(env.DB)
        .select({
          id: feed.id,
          link: feed.link,
        })
        .from(feed)
        .all()
      const chunks = _.chunk(feedAll, syncFeedsChunkSize)
      for (const chunk of chunks) {
        await env.MY_QUEUE.send({
          type: 'syncFeedsChunk',
          payload: { chunk },
        })
      }
    },
    async syncFeedByChunk(payload: SyncFeedsChunkPayload): Promise<void> {
      const now = new Date()
      const insertedEntries: string[] = []
      for (const f of payload.chunk) {
        const cli = createRSSClient()
        const ff = await cli.fetchFeed({ url: f.link })
        await d1
          .update(feed)
          .set({
            title: ff?.title,
            updated: ff?.updated,
          })
          .where(eq(feed.id, f.id))
          .returning()

        const entries = ff?.entries?.map(e => {
          // Sanitize the description html
          const clean = sanitizeHtml(e.description ?? '')

          return {
            ...e,
            description: clean,
            feedId: f.id,
            vectors: null,
            metadata: null,
          }
        })
        if (!entries) {
          continue
        }
        // Insert feeds in chunks of 10
        for (const chunk of _.chunk(entries, 10)) {
          const inserted = await d1
            .insert(feedEntry)
            .values(chunk)
            .returning({
              id: feedEntry.id,
            })
            .onConflictDoNothing()
          insertedEntries.push(...inserted.map(i => i.id))
        }
      }
      // Process the inserted entries
      for (const id of insertedEntries) {
        await env.MY_QUEUE.send({
          type: 'processFeedEntry',
          payload: { id },
        })
      }
    },
    async processFeedEntry(payload: ProcessFeedEntryPayload): Promise<void> {
      console.debug('processFeedEntry', payload.id)
      const entries = await d1
        .select()
        .from(feedEntry)
        .where(eq(feedEntry.id, payload.id))
      const e = entries[0]
      const { title, description: descriptionHTML } = e
      if (descriptionHTML === null || descriptionHTML === '') {
        console.debug('No description found for', title)
        return
      }
      // NOTE: rootElement is used to wrap the description text
      const $ = cheerio.load(`<rootElement>${descriptionHTML}</rootElement>`)
      const descriptionText = $('rootElement').text()
      const genaiClient = createGenAIClient(env)
      const texts = [e.title]
      // TODO: consider using a better way to split the text. ? and ! are not handled
      const firstSentence = descriptionText.split('.').shift()
      if (firstSentence) {
        texts.push(firstSentence.trim())
      }
      const [metadata, vectors] = await Promise.allSettled([
        createRSSClient().fetchEntryMetadata({ url: e.link }),
        genaiClient.vectorize(texts),
      ])
      if (metadata.status !== 'fulfilled' || vectors.status !== 'fulfilled') {
        console.error('Failed to fetch metadata or vectors', metadata, vectors)
        return
      }
      console.debug('metadata', metadata.value)
      const vectorArray = vectors.value.map((v, i) => ({
        id: `${e.feedId}__${e.id}__${i}`,
        values: v,
        namespace: 'feedEntry',
        metadata: {
          index: i,
          id: e.id,
          feedId: e.feedId,
          src: i === 0 ? 'title' : 'description',
        },
      }))
      const [updated, upserted] = await Promise.allSettled([
        d1
          .update(feedEntry)
          .set({
            ogImage: metadata.value?.ogImage ?? null,
            vectors: JSON.stringify(vectors.value),
          })
          .where(eq(feedEntry.id, e.id)),
        genaiClient.upsert(vectorArray),
      ])
      if (updated.status !== 'fulfilled' || upserted.status !== 'fulfilled') {
        console.error('Failed to update or upsert', updated, upserted)
        return
      }
      await d1
        .update(feedEntry)
        .set({ processedAt: new Date() })
        .where(eq(feedEntry.id, e.id))
      console.debug('processFeedEntry done', e.id)
    },
  }
}
