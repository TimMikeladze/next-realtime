/* eslint-disable no-underscore-dangle */
import { revalidateTag } from 'next/cache';

export type PublishFn = (channel: string, message: string) => Promise<any>;

export type SubscribeFn = (
  channel: string,
  callback: () => void
) => Promise<void>;

export type OnMessageFn = (
  channel: string,
  enqueue: (message: any) => void
) => Promise<void>;

export const configNextRealtime = (options: {
  onMessage: OnMessageFn;
  publish: PublishFn;
  subscribe: SubscribeFn;
}) => {
  const revalidateRealtimeTag = (tags: string[] | string = []) => {
    const _tags = Array.isArray(tags) ? tags : [tags];
    _tags.forEach((tag) => {
      revalidateTag(tag);
    });
    return options.publish('next-realtime', JSON.stringify({ tags: _tags }));
  };

  const NextRealtimeStreamHandler = () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        await options.subscribe('next-realtime', () => {});
        const enqueue = (message: any) => {
          try {
            controller.enqueue(encoder.encode(message));
          } catch (e) {
            //
          }
        };
        await options.onMessage('next-realtime', enqueue);
      },
    });
    return new Response(stream);
  };

  const NextRealtimePollingHandler = () => {};

  return {
    NextRealtimeStreamHandler,
    NextRealtimePollingHandler,
    revalidateRealtimeTag,
  };
};

export const configNextRealtimeRedis = (redis: any) =>
  configNextRealtime({
    publish: async (channel: any, message: any) => {
      await redis.publish(channel, message);
    },
    subscribe: async (channel: any, callback: any) => {
      await redis.subscribe(channel, callback);
    },
    onMessage: async (channel: any, enqueue: any) => {
      await redis.on('message', (_channel: string, message: string) => {
        enqueue(message);
      });
    },
  });

export const configNextRealtimePostgres = (client: any) =>
  configNextRealtime({
    publish: async (channel: any, message: any) => {
      await client.notify(channel, message);
    },
    subscribe: async () => {},
    onMessage: async (channel, enqueue: any) => {
      await client.listen(channel, (message: string) => {
        enqueue(message);
      });
    },
  });
