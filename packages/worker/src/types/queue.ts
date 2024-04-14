export interface QMessageBody {
  type: 'syncFeeds' | 'syncFeedsChunk' | 'processFeedEntry'
  payload: SyncFeedsPayload | SyncFeedsChunkPayload | ProcessFeedEntryPayload
}
export type SyncFeedsPayload = {}
export interface SyncFeedsChunkPayload {
  chunk: {
    id: string
    link: string
  }[]
}

export interface ProcessFeedEntryPayload {
  id: string
}
