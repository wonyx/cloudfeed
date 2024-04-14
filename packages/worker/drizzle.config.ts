import type { Config } from 'drizzle-kit'

export default {
  schema: './src/infra/db/schema.ts',
  out: './drizzle/migrations',
  driver: 'd1',
  dbCredentials: {
    wranglerConfigPath: 'wrangler.toml',
    dbName: 'cloudfeed-worker-db',
  },
} satisfies Config
