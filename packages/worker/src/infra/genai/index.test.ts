import { describe, expect, it } from 'vitest'
import { stringify } from './ndjson'

describe('ndjson', () => {
  it('stringify', () => {
    const data = [{ a: 1 }, { b: 2 }]
    const res = stringify(data)
    expect(res).toBe('{"a":1}\n{"b":2}')
  })
})
