# ⌚️ next-realtime

Drop-in realtime data for the unstable Next.js cache.

Examples include:

- A comment section with live updates.
- A collaborative todo list.
- A multiplayer card game.
- Real-time data updates where the data is not updated on a regular interval and time-based invalidation isn't an preferable solution.

> 🔬 This is a highly experimental project.

This project is a proof-of-concept of drop-in solution for adding realtime data to a Next.js app. The goal is to provide a low overhead solution for adding realtime data to a Next.js app by leveraging the unstable Next.js cache, HTTP Streaming and a message broker like Redis.

Instead of streaming realtime updates to the client directly, the client is subscribed to a stream of cache tags that have been invalidated. The client then uses the Next.js API to revalidate the cache for each tag. React Server Components which rely on data from the `unstable_cache` are then re-rendered with the latest data.

Check out this [example](https://github.com/TimMikeladze/next-realtime/tree/master/examples/next-realtime-example) of a Next.js codebase showcasing an implementation of a simple Todo-list app using `next-realtime`.

> 🚧 Under active development. Expect breaking changes until v1.0.0.

## 📡 Install

```console
npm install next-realtime

yarn add next-realtime

pnpm add next-realtime
```

> 👋 Hello there! Follow me [@linesofcode](https://twitter.com/linesofcode) or visit [linesofcode.dev](https://linesofcode.dev) for more cool projects like this one.

## 🚀 Getting Started

First, configure `next-realtime` by providing some required values like specifying a message broker.

**app/realtime/config.ts**

```ts
// Supports Redis or Postgres as a message broker.
import Redis from 'ioredis';
import postgres from 'postgres';
import {
  configNextRealtimeRedis,
  configNextRealtimePostgres,
} from 'next-realtime/server';

export const redis = new Redis(process.env.REDIS_CONNECTION_STRING as string);
// or
export const client = postgres(
  `${process.env.PG_CONNECTION_STRING}/${process.env.PG_DB}`
);

export const {
  NextRealtimeStreamHandler,
  revalidateRealtimeTag,
  getRealtimeSessionId,
} = configNextRealtimeRedis(redis);
```

Now create a route that will stream data to the client.

**app/realtime/route.ts**

```ts
import { NextRequest } from 'next/server';
import { NextRealtimeStreamHandler } from './config';

export const dynamic = 'force-dynamic';

export const GET = (request: NextRequest) => NextRealtimeStreamHandler(request);
```

**app/realtime/page.ts**

```ts

```

<!-- TSDOC_START -->

<!-- TSDOC_END -->
