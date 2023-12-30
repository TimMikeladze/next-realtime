import { nanoid } from 'nanoid';
import { useCallback, useState, useTransition } from 'react';
// @ts-ignore
import { useStream } from 'react-fetch-streams';

export interface NextLiveProps {
  revalidateTag: (tag: string) => Promise<void>;
}

export const NextLive = (props: NextLiveProps) => {
  const [, startTransition] = useTransition();

  const onNext = useCallback(async (res: any) => {
    try {
      const data = (await res.json()) || {};
      if (data.tags) {
        data.tags.forEach((tag: string) => {
          // console.log('revalidating tag', tag);
          startTransition(() => {
            props.revalidateTag(tag);
          });
        });
      } else {
        // console.log('no tags', data);
      }
    } catch (e) {
      // console.log('error', e);
    }
    // data.forEach((tag: string) => {
    //   startTransition(() => {
    //     props.revalidateTag(tag);
    //   });
    // });
  }, []);

  const onError = useCallback(() => {
    // console.log('error', error);
  }, []);

  const url = `/next-live`;

  const [id, setId] = useState(nanoid());

  const onDone = useCallback(() => {
    setId(nanoid());
    console.log('Reconnecting to stream...');
  }, [id]);

  useStream(`${url}?id=${id}`, {
    onNext,
    onError,
    onDone,
  });

  return null;
};
