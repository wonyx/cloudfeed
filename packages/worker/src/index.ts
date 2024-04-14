import { app } from './handlers/fetch'
import { queue } from './handlers/queue'
import { scheduled } from './handlers/scheduled'

export default {
  fetch: app.fetch,
  scheduled,
  queue,
}
