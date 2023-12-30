import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_CONNECTION_STRING as string);
