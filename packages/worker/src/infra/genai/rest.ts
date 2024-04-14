import { Ai } from '@cloudflare/ai'
import * as genai from '../../types/genai'
import ndjson from './ndjson'
interface queryInput {
  returnMetadata?: boolean
  returnValues?: boolean
  topK: number
  vector: number[]
  filter?: genai.Filter
}
interface queryOutput {
  errors: any[]
  messages: any[]
  result: genai.QueryResult
  success: boolean
}

export class RestGenAIClient implements genai.GenAi {
  private ai: Ai
  private baseUrl: string
  private commonHeaders: Record<string, string>
  constructor({
    accountId,
    apiKey,
    indexName,
    ai,
  }: { accountId: string; apiKey: string; indexName: string; ai: Ai }) {
    this.ai = ai
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/vectorize/indexes/${indexName}`
    this.commonHeaders = {
      Authorization: `Bearer ${apiKey}`,
    }
  }
  async vectorize(text: string | string[]): Promise<number[][]> {
    console.debug('vectorize', text)
    const res = await this.ai.run('@cf/baai/bge-large-en-v1.5', { text })

    return res.data
  }
  async upsert(
    vectorArray: genai.Vector[],
  ): Promise<genai.MutationResult | undefined> {
    const body = ndjson.stringify(vectorArray)
    // console.debug('upsert', body)

    const res = await fetch(`${this.baseUrl}/upsert`, {
      method: 'POST',
      headers: {
        ...this.commonHeaders,
        'Content-Type': 'application/x-ndjson',
      },
      body,
    })
    return
  }
  async query(
    vector: number[],
    topK: number,
    filter?: genai.Filter,
  ): Promise<genai.QueryResult | undefined> {
    const input: queryInput = {
      returnMetadata: true,
      //   returnValues: true,
      topK,
      vector,
      filter,
    }
    const res = await fetch(`${this.baseUrl}/query`, {
      method: 'POST',
      headers: {
        ...this.commonHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })
    if (!res.ok) {
      console.error('rest query error', res.status)
      return undefined
    }
    const data = await res.json<queryOutput>()
    return data.result
  }
}
