import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

let db: ReturnType<typeof drizzle>;

export const getDbServer = () => {
  if (!db) {
    // eslint-disable-next-line no-underscore-dangle
    const _client = postgres(
      `${process.env.PG_CONNECTION_STRING}/${process.env.PG_DB}`
    );
    db = drizzle(_client);
  }

  return db;
};
