import { NextRealtimeStream } from 'next-realtime/client';
import { revalidateTag } from 'next/cache';
import TodoList from '../components/TodoList';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <>
      <NextRealtimeStream
        type="redis"
        revalidateTag={async (tag: string) => {
          'use server';

          revalidateTag(tag);
        }}
      />
      <TodoList />
    </>
  );
}
