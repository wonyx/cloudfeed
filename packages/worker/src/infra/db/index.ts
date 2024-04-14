import { drizzle } from 'drizzle-orm/d1'

export function db(d1: D1Database) {
  return drizzle(d1)
}
