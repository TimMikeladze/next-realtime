import { getDbServer } from './getDbServer';
import { getDbServerless } from './getDbServerless';

export const getDb = async () =>
  process.env.VERCEL ? getDbServerless() : getDbServer();
