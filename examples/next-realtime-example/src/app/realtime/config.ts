import Redis from 'ioredis';
import { configNextRealtimeRedis } from 'next-realtime/server';

export const redis = new Redis(process.env.REDIS_CONNECTION_STRING as string);

export const {
  NextRealtimeStreamHandler,
  revalidateRealtimeTag,
  getRealtimeSessionId,
} = configNextRealtimeRedis(redis);
