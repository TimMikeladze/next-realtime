'use server';

import { revalidateRealtimeTag } from '../app/realtime/config';
import { getDb } from '../drizzle/getDb';
import { todoTable } from '../drizzle/schema';

export const clearTodos = async () => {
  const db = await getDb();

  await db.delete(todoTable).execute();

  await revalidateRealtimeTag('todos');
};
