import _ from 'lodash'
import { Env } from '../../types'
import {
  ProcessFeedEntryPayload,
  QMessageBody,
  SyncFeedsChunkPayload,
} from '../../types/queue'
import { createJobClient } from './job'

export const queue: ExportedHandlerQueueHandler<Env, QMessageBody> = async (
  batch,
  env,
  ctx,
) => {
  console.debug(`consumed from our queue: ${batch.messages}`)
  for (const message of batch.messages) {
    console.debug('message', message)
    switch (message.body.type) {
      case 'syncFeeds': {
        const start = new Date()
        await createJobClient(env).syncFeeds({})
        const end = new Date()
        console.debug('syncFeeds took', end.getTime() - start.getTime(), 'ms')
        break
      }
      case 'syncFeedsChunk': {
        const start = new Date()
        await createJobClient(env).syncFeedByChunk(
          message.body.payload as SyncFeedsChunkPayload,
        )
        const end = new Date()
        console.debug(
          'syncFeedsChunk took',
          end.getTime() - start.getTime(),
          'ms',
        )
        break
      }
      case 'processFeedEntry': {
        const start = new Date()
        await createJobClient(env).processFeedEntry(
          message.body.payload as ProcessFeedEntryPayload,
        )
        const end = new Date()
        console.debug(
          'processFeedEntry took',
          end.getTime() - start.getTime(),
          'ms',
        )

        break
      }
      default:
        console.debug('invalid message', message)
    }
  }
  console.debug('queue processed')
}
