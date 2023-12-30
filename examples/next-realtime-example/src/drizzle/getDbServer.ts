import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

let db: ReturnType<typeof drizzle>;

// eslint-disable-next-line no-underscore-dangle
export const client = postgres(
  `${process.env.PG_CONNECTION_STRING}/${process.env.PG_DB}`
);

export const getDbServer = () => {
  if (!db) {
    db = drizzle(client);
  }

  return db;
};
