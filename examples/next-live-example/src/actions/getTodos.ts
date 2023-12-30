'use server';

// eslint-disable-next-line camelcase
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
    tags: ['todos'],
  }
);
