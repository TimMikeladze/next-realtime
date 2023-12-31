/* eslint-disable no-underscore-dangle */
import { revalidateTag } from 'next/cache';
import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

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
  const encoder = new TextEncoder();

  const revalidateRealtimeTag = (tags: string[] | string = []) => {
    const _tags = Array.isArray(tags) ? tags : [tags];
    _tags.forEach((tag) => {
      revalidateTag(tag);
    });
    return options.publish(
      'next-realtime',
      JSON.stringify({ realtimeSessionId: getRealtimeSessionId(), tags: _tags })
    );
  };

  const NextRealtimeStreamHandler = (request: NextRequest) => {
    const cookieStore = cookies();
    const streamId = request.nextUrl.searchParams.get('id');
    if (!streamId) {
      return Response.json({ error: 'id is required' }, { status: 400 });
    }
    const sessionId = cookieStore.get('next-realtime-session-id')?.value;
    if (!sessionId) {
      return Response.json({ error: 'sessionId is required' }, { status: 400 });
    }

    const stream = new ReadableStream({
      async start(controller) {
        await options.subscribe('next-realtime', () => {});
        const enqueue = (message: any) => {
          const data = JSON.parse(message);
          try {
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  tags: data.tags,
                })
              )
            );
          } catch (e) {
            //
          }
        };
        await options.onMessage('next-realtime', enqueue);
      },
    });
    return new Response(stream);
  };

  return {
    NextRealtimeStreamHandler,
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

export const createRealtimeSessionId = (sessionId: string = nanoid()) => {
  const cookieStore = cookies();
  const found = cookieStore.get('next-realtime-session-id');
  if (found) {
    return found;
  }
  cookieStore.set('next-realtime-session-id', sessionId, { secure: true });
  return sessionId;
};

export const getRealtimeSessionId = () => {
  const cookieStore = cookies();
  const found = cookieStore.get('next-realtime-session-id');
  return found?.value;
};
