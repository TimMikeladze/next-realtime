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

export const { NextRealtimeStreamHandler, revalidateRealtimeTag } =
  configNextRealtimeRedis(redis);
```

Now create a route that will stream data to the client.

**app/realtime/route.ts**

```ts
import { NextRequest } from 'next/server';
import { NextRealtimeStreamHandler } from './config';

export const dynamic = 'force-dynamic';

export const GET = (request: NextRequest) => NextRealtimeStreamHandler(request);
```

Somewhere near the root of your app, inside of a React Server Component, render a `NextRealtimeStreamProvider`. This component will handle subscribing to the stream of tags and revalidating the cache.

**app/realtime/layout.ts**

```tsx
import { NextRealtimeStreamProvider } from 'next-realtime/react';
import { createRealtimeSessionId } from 'next-realtime/server';

import { revalidateTag } from 'next/cache';

import { ReactNode } from 'react';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <NextRealtimeStreamProvider
      revalidateTag={async (tag: string) => {
        'use server';

        revalidateTag(tag);
      }}
      sessionId={async () => {
        'use server';

        return createRealtimeSessionId();
      }}
    >
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </NextRealtimeStreamProvider>
  );
}
```

## 🛰️ Usage

1. Choose a cache tag whose data you want to make realtime. In this example, we'll use the tag `todos`.
2. Create an action that will fetch data and pass it through the `unstable_cache` function with the chosen cache tag.
3. Create a React Server Component that will fetch async data from the action and render it.
4. Create an action that will add new data to the database and invalidate the chosen cache tag.

**src/actions/getTodos.tsx**

```ts
'use server';

import { unstable_cache } from 'next/cache';
import { desc } from 'drizzle-orm';
import { getDb } from '../drizzle/getDb';
import { todoTable } from '../drizzle/schema';

export const getTodos = unstable_cache(
  async () => {
    const db = await getDb();

    return db.select().from(todoTable).orderBy(desc(todoTable.createdAt));
  },
  [],
  {
    tags: ['todos'], // 👈 define a tag to make realtime
  }
);
```

**src/components/TodoList.tsx**

```tsx
import { getTodos } from '../actions/getTodos'; // 👈
import TodoCard from './TodoCard';
import { AddTodoButton } from './AddTodoButton';

const TodoList = async () => {
  // 👈 async react component
  const todos = await getTodos();

  return (
    <div className="container p-4">
      <AddTodoButton />
      <div className="space-y-4">
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
};

export default TodoList;
```

**src/actions/addTodo.ts**

```ts
'use server';

import { nanoid } from 'nanoid';
import { getRealtimeSessionId } from 'next-realtime/server';
import { revalidateRealtimeTag } from '../app/realtime/config'; // 👈
import { getDb } from '../drizzle/getDb';
import { todoTable } from '../drizzle/schema';

export const addTodo = async ({ text }: { text: string }) => {
  if (!text || !text.trim().length) {
    return;
  }

  const db = await getDb();

  await db.insert(todoTable).values({
    id: nanoid(),
    text: text.trim(),
    realtimeSessionId: getRealtimeSessionId(),
  });

  await revalidateRealtimeTag('todos'); // 👈
};
```

**src/components/AddTodoButton.tsx**

```tsx
'use client';

import React, { useTransition, useState } from 'react';
import { nanoid } from 'nanoid';
import { addTodo } from '../actions/addTodo';

export const AddTodoButton = () => {
  const [, startTransition] = useTransition();
  const [todoText, setTodoText] = useState('');

  const handleAddTodo = () => {
    startTransition(() =>
      addTodo({
        text: todoText || `Random todo ${nanoid(4)}`,
      })
    );
    setTodoText(''); // Clear the input field after adding todo
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
        className="mr-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500 "
        placeholder="Enter todo"
      />
      <button
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-600"
        type="button"
        onClick={handleAddTodo}
      >
        Add todo
      </button>
    </div>
  );
};
```

<!-- TSDOC_START -->

<!-- TSDOC_END -->
