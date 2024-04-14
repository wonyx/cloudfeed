import * as genai from '../../types/genai'

export class MockGenAIClient implements genai.GenAi {
  vectorize(text: string | string[]): Promise<number[][]> {
    return Promise.resolve([[1, 2, 3]])
  }
  upsert(
    vectorArray: genai.Vector[],
  ): Promise<genai.MutationResult | undefined> {
    return Promise.resolve({ ids: ['1', '2'], count: 2 })
  }
  query(
    vector: number[],
    topK: number,
  ): Promise<genai.QueryResult | undefined> {
    return Promise.resolve({ count: 1, matches: [{ score: 0.5, id: '1' }] })
  }
}
