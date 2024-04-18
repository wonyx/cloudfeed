import _ from 'lodash'
import { Env } from '../../types'

export const scheduled: ExportedHandlerScheduledHandler<Env> = async (
  event,
  env,
  ctx,
) => {
  console.debug('cron started', JSON.stringify(event))
  switch (event.cron) {
    case '0 */3 * * *': {
      await env.MY_QUEUE.send({
        type: 'syncFeeds',
        payload: {},
      })
      break
    }
    default:
      console.debug('cron not found', event.cron)
  }
  console.debug('cron ended')
}
