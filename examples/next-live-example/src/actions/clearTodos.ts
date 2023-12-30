'use server';

import { revalidateLiveTag } from '../app/next-live/config';
import { getDb } from '../drizzle/getDb';
import { todoTable } from '../drizzle/schema';

export const clearTodos = async () => {
  const db = await getDb();

  await db.delete(todoTable).execute();

  await revalidateLiveTag('todos');
};
