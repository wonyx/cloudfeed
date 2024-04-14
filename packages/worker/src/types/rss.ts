interface RSSClient {
  fetchFeed(params: { url: string }): Promise<Feed | undefined>
  fetchEntryMetadata(params: { url: string }): Promise<
    EntryMetadata | undefined
  >
}
type FeedEntry = {
  id: string
  entryId: string
  title: string
  link: string
  media: string[]
  description?: string
  pubDate: Date
}
type Feed = {
  id: string
  title: string
  link: string
  updated: Date
  entries: Omit<FeedEntry, 'id'>[] | undefined
}
type EntryMetadata = {
  ogImage?: string
}
