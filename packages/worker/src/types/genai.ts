export interface GenAi {
  vectorize(text: string | string[]): Promise<number[][]>
  upsert(vectorArray: Vector[]): Promise<MutationResult | undefined>
  query(
    vector: number[],
    topK: number,
    filter?: Filter,
  ): Promise<QueryResult | undefined>
}
export type Filter = Record<string, Record<string, string>>

export interface QueryResult {
  count: number
  matches: Match[]
}
export interface Match {
  score: number
  id: string
  namespace?: string
  metadata?: Metadata
}
export interface Vector {
  id: string
  values: number[]
  namespace?: string
  metadata: Metadata
}
export interface MutationResult {
  ids: string[]
  count: number
}

export interface Metadata {
  index: number
  id: string
  feedId: string
  src: string
}
