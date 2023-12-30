/* eslint-disable no-underscore-dangle */
import { revalidateTag } from 'next/cache';

export type PublishFn = (channel: string, message: string) => Promise<any>;

export type SubscribeFn = (
  channel: string,
  callback: () => void
) => Promise<void>;

export type OnMessageFn = (callback: (message: any) => void) => Promise<void>;

export const configNextLive = (options: {
  onMessage: OnMessageFn;
  publish: PublishFn;
  subscribe: SubscribeFn;
}) => {
  const revalidateLiveTag = (tags: string[] | string = []) => {
    const _tags = Array.isArray(tags) ? tags : [tags];
    _tags.forEach((tag) => {
      revalidateTag(tag);
    });
    return options.publish('next-live', JSON.stringify({ tags: _tags }));
  };

  const NextLiveStreamHandler = () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        await options.subscribe('next-live', () => {});
        const enqueue = (message: any) => {
          try {
            controller.enqueue(encoder.encode(message));
          } catch (e) {
            //
          }
        };
        await options.onMessage(enqueue);
      },
    });
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache, no-transform',
        'Content-Encoding': 'none',
      },
    });
  };

  const NextLivePollingHandler = () => {};

  return {
    NextLiveStreamHandler,
    NextLivePollingHandler,
    revalidateLiveTag,
  };
};

export const configNextLiveRedis = (redis: any) =>
  configNextLive({
    publish: async (channel: any, message: any) => {
      await redis.publish(channel, message);
    },
    subscribe: async (channel: any, callback: any) => {
      await redis.subscribe(channel, callback);
    },
    onMessage: async (enqueue: any) => {
      await redis.on('message', (channel: string, message: string) => {
        enqueue(message);
      });
    },
  });
