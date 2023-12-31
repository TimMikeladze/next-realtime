import { getDbServerless } from './getDbServerless';

export const getDb = async () =>
  // process.env.VERCEL ? getDbServerless() : getDbServer();
  getDbServerless();
