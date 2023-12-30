import { nanoid } from 'nanoid';
import { useCallback, useState, useTransition, useEffect, useRef } from 'react';
// @ts-ignore
import { useStream } from 'react-fetch-streams';

export interface NextLiveProps {
  baseUrl?: string;
  path?: string;
  revalidateTag: (tag: string) => Promise<void>;
}

export const NextLiveStream = (props: NextLiveProps) => {
  const [, startTransition] = useTransition();

  const onNext = useCallback(async (res: any) => {
    try {
      const data = (await res.json()) || {};
      if (data.tags) {
        data.tags.forEach((tag: string) => {
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
  }, []);

  const onError = useCallback(() => {
    // console.log('error', error);
  }, []);

  const url = `${props.baseUrl || ''}/${props.path || `next-live`}`;

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

export interface NextLivePollingProps extends NextLiveProps {
  pollInterval?: number;
}

export const NextLivePolling = (props: NextLivePollingProps) => {
  const isPageVisible = usePageVisibility();
  const timerIdRef = useRef(null);
  const [isPollingEnabled, setIsPollingEnabled] = useState(true);

  useEffect(() => {
    const pollingCallback = async () => {
      const res = await fetch(
        `${props.baseUrl || ''}/${props.path || `next-live`}`
      );

      if (res.status === 200) {
        const data = await res.json();
        if (data.tags) {
          data.tags.forEach((tag: string) => {
            props.revalidateTag(tag);
          });
        }
      }

      // Your polling logic here
      console.log('Polling...');

      setIsPollingEnabled(false);
    };

    const startPolling = () => {
      pollingCallback(); // To immediately start fetching data
      (timerIdRef as any).current = setInterval(
        pollingCallback,
        props.pollInterval || 1000
      );
    };

    const stopPolling = () => {
      clearInterval((timerIdRef as any).current);
    };

    if (isPageVisible && isPollingEnabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [isPageVisible, isPollingEnabled]);
};

export const usePageVisibility = () => {
  const [isPageVisible, setIsPageVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isPageVisible;
};
