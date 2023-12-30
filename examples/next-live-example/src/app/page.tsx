import { NextLiveStream } from 'next-live/client';
import { revalidateTag } from 'next/cache';
import TodoList from '../components/TodoList';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <>
      <NextLiveStream
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
