import { configNextLiveRedis } from 'next-live';
import { redis } from './redis';

export const { NextLiveStreamHandler, revalidateLiveTag } =
  configNextLiveRedis(redis);
