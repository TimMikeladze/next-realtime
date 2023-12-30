import { configNextLiveRedis } from 'next-live';
import { redis } from './redis';

export const { NextLiveHandler, revalidateLiveTag } =
  configNextLiveRedis(redis);
