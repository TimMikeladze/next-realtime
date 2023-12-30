import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

neonConfig.fetchConnectionCache = true;

export const client = neon(
  `${process.env.PG_CONNECTION_STRING}/${process.env.PG_DB}`
);

const db = drizzle(client);

export const getDbServerless = () => db;
