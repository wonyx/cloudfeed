import { and, desc, eq, inArray, isNull, ne, or, sql } from 'drizzle-orm'
import { db } from '.'
import { Env } from '../../types'
import { feed, feedEntry, feedEntryAction } from './schema'
export type listFeedEntriesFilter = {
  feedId?: string
  unread?: boolean
}
export type listFeedEntriesInput = {
  filter?: listFeedEntriesFilter
}
export function listFeedEntries(env: Env, input: listFeedEntriesInput) {
  const d1 = db(env.DB)

  const filterConditions = []
  if (input.filter?.feedId) {
    filterConditions.push(eq(feedEntry.feedId, input.filter.feedId))
  }
  if (input.filter?.unread === true) {
    filterConditions.push(
      or(eq(feedEntryAction.read, false), isNull(feedEntryAction.read)),
    )
  }
  const query = d1
    .select({
      id: feedEntry.id,
      title: feedEntry.title,
      feedId: feedEntry.feedId,
      ogImage: feedEntry.ogImage,
      link: feedEntry.link,
      description: feedEntry.description,
      pubDate: feedEntry.pubDate,
      feedTitle: sql<string>`${feed.title}`.as('feedTitle'),
      read: feedEntryAction.read,
    })
    .from(feedEntry)
    .innerJoin(feed, eq(feed.id, feedEntry.feedId))
    .fullJoin(feedEntryAction, eq(feedEntryAction.feedEntryId, feedEntry.id))
    .where(and(...filterConditions))
    .orderBy(desc(feedEntry.pubDate))
    .limit(50)

  return query.all()
}

export async function listFeedEntriesByIds(env: Env, ids: string[]) {
  return await db(env.DB)
    .select({
      id: feedEntry.id,
      title: feedEntry.title,
      feedId: sql<string>`${feed.id}`.as('feedId'),
      link: feedEntry.link,
      description: feedEntry.description,
      pubDate: feedEntry.pubDate,
      feedTitle: sql<string>`${feed.title}`.as('feedTitle'),
    })
    .from(feedEntry)
    .where(inArray(feedEntry.id, ids))
    .innerJoin(feed, eq(feed.id, feedEntry.feedId))
}

export type ListFeedEntriesByIdsOutput = Awaited<
  ReturnType<typeof listFeedEntriesByIds>
>
