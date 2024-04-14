# cloudfeed
This repository is for the [cloudflare ai challenge](https://dev.to/challenges/cloudflare).

cloudfeed is a simple feed reader powered by Cloudflare Workers AI.

## Features
- suggest related entries based on feed feature vector
- job fetches periodically feeds and update feed feature vector
- list feeds
- list entries of a feed 
- display feed entry with feed ogimage and description

## Architecture
this is built on cloudlare pages and workers.

cloudflare pages is used for the frontend.
cloudflare workers is used for the backend.

### Tech Stacks
- frontend
  - next.js with app router and server actions
  - auth.js
  - tailwindcss
  - drizzle orm
  - Cloudflare Pages
    - D1
- backend
  - hono
  - drizzle orm
  - Cloudflare Workers
    - Workers AI
    - Vectorize
    - D1
    - Queue
    - Cron

### Structure
this repository is a monorepo with the following structure:
- packages
  - [app (cloudflare pages)](./packages/app/README.md)
  - [worker (cloudflare workers)](./packages/worker/README.md)

you can see more details in each package README.md.

## CAUTION
This repository is for the cloudflare ai challenge and is not intended for production use.