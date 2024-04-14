import { AppType, sign } from '@cloudfeed/worker/api'
import { hc } from 'hono/client'
import type { InferResponseType } from 'hono/client'
import { Session } from 'next-auth'

export const client = hc<AppType>(process.env.WORKER_API_URL)
export async function createHeaders(
  session: Session,
): Promise<Record<string, string>> {
  if (!session.user?.id) {
    return {}
  }
  const payload = {
    sub: session.user.id,
    exp: Math.floor(Date.now() / 1000) + 60, // Token expires in 1 minutes
  }
  const signed = await sign(payload, process.env.CLOUD_FEED_JWT_SECRET ?? '')

  return {
    Authorization: `Bearer ${signed}`,
  }
}
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never
const $listFeeds = client.api.feeds.$get
export type ListFeedsResponseType = InferResponseType<typeof $listFeeds>
const $listFeedEntries = client.api.feeds[':id'].entries.$get
export type ListFeedEntriesResponseType = InferResponseType<
  typeof $listFeedEntries
>
export type FeedEntryType = ArrayElement<ListFeedEntriesResponseType>
