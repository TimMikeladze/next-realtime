import Redis from 'ioredis';
import { configNextRealtimePostgres } from 'next-realtime';
import { client } from '../../drizzle/getDbServer';

export const redis = new Redis(process.env.REDIS_CONNECTION_STRING as string);

export const { NextRealtimeStreamHandler, revalidateRealtimeTag } =
  // configNextRealtimeRedis(redis);
  configNextRealtimePostgres(client);
