import { NextRealtimeStreamProvider } from 'next-realtime/react';
import { createRealtimeSessionId } from 'next-realtime/server';

import { revalidateTag } from 'next/cache';
import TodoList from '../components/TodoList';

export const dynamic = 'force-dynamic';

export default async function Home() {
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
      <TodoList />
    </NextRealtimeStreamProvider>
  );
}
