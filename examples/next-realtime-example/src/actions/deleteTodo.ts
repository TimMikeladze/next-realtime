'use server';

import { eq } from 'drizzle-orm';
import { revalidateRealtimeTag } from '../app/realtime/config';
import { getDb } from '../drizzle/getDb';
import { todoTable } from '../drizzle/schema';

export const deleteTodo = async ({ id }: { id: string }) => {
  if (!id || !id.trim().length) {
    return;
  }

  const db = await getDb();

  await db.delete(todoTable).where(eq(todoTable.id, id));

  await revalidateRealtimeTag('todos');
};
