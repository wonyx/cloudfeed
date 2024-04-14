import { createId } from '@paralleldrive/cuid2'
import { is, sql } from 'drizzle-orm'
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'

const idColumn = {
  id: text('id')
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
}
const timestampColumns = {
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updatedAt', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull()
    .$onUpdateFn(() => new Date()),
}

export const feed = sqliteTable('feed', {
  id: idColumn.id,
  title: text('title'),
  link: text('link').unique().notNull(),
  updated: integer('updated', { mode: 'timestamp' }),
  ...timestampColumns,
})

export const feedEntry = sqliteTable(
  'feedEntry',
  {
    id: idColumn.id,
    entryId: text('entryId').notNull(),
    title: text('title').notNull(),
    link: text('link').notNull(),
    description: text('description'),
    pubDate: integer('pubDate', { mode: 'timestamp' }).notNull(),
    feedId: text('feedId')
      .notNull()
      .references(() => feed.id, {
        onDelete: 'set null',
      }),
    vectors: text('vectors', { mode: 'json' }),
    ogImage: text('ogImage'),
    processedAt: integer('processedAt', { mode: 'timestamp' }),
    ...timestampColumns,
  },
  table => {
    return {
      feedEntryIdx: uniqueIndex('feed_entry_idx').on(
        table.feedId,
        table.entryId,
      ),
    }
  },
)

export const feedEntryAction = sqliteTable(
  'feedEntryAction',
  {
    userId: text('userId').notNull(),
    feedEntryId: text('feedEntryId')
      .notNull()
      .references(() => feedEntry.id, { onDelete: 'cascade' }),
    read: integer('read', { mode: 'boolean' }).default(false).notNull(),
    ...timestampColumns,
  },
  table => {
    return {
      pk: primaryKey({ columns: [table.userId, table.feedEntryId] }),
    }
  },
)
