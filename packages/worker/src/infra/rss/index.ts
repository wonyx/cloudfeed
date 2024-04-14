import * as cheerio from 'cheerio'
import * as htmlparser2 from 'htmlparser2'
export function createRSSClient(): RSSClient {
  return {
    async fetchFeed({ url }: { url: string }) {
      const res = await fetch(url)
      const feed = htmlparser2.parseFeed(await res.text())
      const entries = feed?.items
        .filter(item => item?.id && item?.title && item?.link && item?.pubDate)
        .map(item => {
          const pubDate = new Date(item.pubDate!)
          return {
            entryId: item.id, // Ensure id is of type string
            title: item.title,
            link: item.link,
            media: [],
            description: item.description,
            pubDate,
          } as Omit<FeedEntry, 'id'>
        })
      return {
        id: feed?.id!,
        title: feed?.title!,
        link: feed?.link!,
        updated: new Date(),
        entries,
      } satisfies Feed
    },
    async fetchEntryMetadata({
      url,
    }: { url: string }): Promise<EntryMetadata | undefined> {
      const res = await fetch(url)
      const $ = cheerio.load(await res.text())
      const ogImage = $('meta[property="og:image"]').attr('content')
      return { ogImage }
    },
  }
}
