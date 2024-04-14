This is a [Next.js](https://nextjs.org/) project bootstrapped with [`c3`](https://developers.cloudflare.com/pages/get-started/c3).

## Prerequisites
- pnpm
- github account

## Setup
### Create an OAuth App of github
see [Creating an OAuth App](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)

generate your `client_id` and `client_secret` and set the following values in `.env.local`.

### env
```bash
cp .env.local.example .env.local
```

replace the following values in `.env.local` with your own values.
```
AUTH_SECRET=<your secret>
AUTH_GITHUB_SECRET=<put your github client secret>
AUTH_GITHUB_ID=<put your github client id>
CLOUD_FEED_JWT_SECRET=<your secret>
```

### Create D1 Database
see [create a database](https://developers.cloudflare.com/d1/get-started/#3-create-a-database)
### wrangler.toml
```toml
name = <put your app name>
compatibility_date = "2024-04-05"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = <put your database name>
database_id = <put your database id>
preview_database_id = "DB"
migrations_dir = "drizzle/migrations"
```

### install dependencies
```bash
pnpm install
```

### apply migration of local database
```bash
pnpm migrate
```
## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
