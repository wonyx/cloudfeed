# worker
## Prerequisites
- pnpm
- Cloudflare Workers Paid Plan

## Setup
### Install dependencies
```
pnpm install
```
### D1 Database
```
npx wrangler d1 create your-worker-db
```

### Vectorize
```
npx wrangler vectorize create your-vector-index --dimensions=1024 --metric=cosine
```
### wrangler.toml
```toml
name = <put your worker name>
main = "src/index.ts"
compatibility_date = "2024-04-05"
compatibility_flags = ["nodejs_compat"]

[dev]
port = 8888

[triggers]
crons = [ "0 */3 * * *" ]

[[queues.producers]]
 queue = "my-queue"
 binding = "MY_QUEUE"

[[queues.consumers]]
queue = "my-queue"
max_batch_size = 5
max_batch_timeout = 5
max_concurrency = 2
max_retries = 1

[ai]
binding = "AI"

[[vectorize]]
binding = "VECTORIZE_INDEX" # available within your Worker on env.VECTORIZE_INDEX
index_name = <put your vector index name>

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = <put your database name>
database_id = <put your database id>
preview_database_id = "DB"
migrations_dir = "drizzle/migrations"
```
### Cloudflare API Key
To develop on local, worker needs to access cloudflare vectorize API.
so you need to create an API token.

see [Create an API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)

allow the following permissions:

Workers AI: Read/Write

Vectorize: Read/Write

### .dev.vars
```
cp .dev.vars.example .dev.vars
```

replace the following values in `.dev.vars` with your own values.
```
USE_MOCK=false
CLOUDFLARE_ACCOUNT_ID=<put your account id>
CLOUDFLARE_API_KEY=<put your api key>
CLOUDFLARE_VECTORIZE_INDEX_NAME=<put your vector index name>
CLOUD_FEED_JWT_SECRET="your secret that same as app"
```

`USE_MOCK` is for mock mode. it mocks the cloudflare api such as Workers AI and Vectorize.

## develop
```
pnpm dev
```

## migration
```
pnpm run migrate
```

## test
### insert feed into database
example
```
npx wrangler d1 execute your-worker-db --local --command='insert into feed (id,link) values("15", "https://blog.cloudflare.com/rss");'
```

### trigger cron job
```
curl "http://localhost:8888/__scheduled?cron=0+0/3+*+*+*"
```
