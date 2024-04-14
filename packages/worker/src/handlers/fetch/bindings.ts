import { QMessageBody } from '../../types/queue'
export type Bindings = {
  MY_QUEUE: Queue<QMessageBody>
  DB: D1Database
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  AI: any
  USE_MOCK: string
  CLOUDFLARE_ACCOUNT_ID: string
  CLOUDFLARE_API_KEY: string
  CLOUDFLARE_VECTORIZE_INDEX_NAME: string
}
