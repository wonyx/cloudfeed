import { drizzle } from 'drizzle-orm/d1'

export function db() {
  return drizzle(process.env.DB)
}
