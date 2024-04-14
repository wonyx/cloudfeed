import { Ai } from '@cloudflare/ai'
import { Env } from '../../types'
import * as genai from '../../types/genai'
import { MockGenAIClient } from './mock'
import { RestGenAIClient } from './rest'

export function createGenAIClient(env: Env): genai.GenAi {
  const ai = new Ai(env.AI)
  // console.debug(env)
  return env.USE_MOCK === 'true'
    ? new MockGenAIClient()
    : new RestGenAIClient({
        accountId: env.CLOUDFLARE_ACCOUNT_ID,
        apiKey: env.CLOUDFLARE_API_KEY,
        indexName: env.CLOUDFLARE_VECTORIZE_INDEX_NAME,
        ai,
      })
}
