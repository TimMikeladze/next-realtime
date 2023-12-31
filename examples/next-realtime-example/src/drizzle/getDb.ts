import { getDbServer } from './getDbServer';

export const getDb = async () =>
  // process.env.VERCEL ? getDbServerless() : getDbServer();
  // getDbServerless();
  getDbServer();
