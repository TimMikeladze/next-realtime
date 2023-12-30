'use server';

import { nanoid } from 'nanoid';
import { revalidateRealtimeTag } from '../app/realtime/config';
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
  });

  await revalidateRealtimeTag('todos');
};
