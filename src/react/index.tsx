import { nanoid } from 'nanoid';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
// @ts-ignore
import { useStream } from 'react-fetch-streams';

export interface NextRealtimeProviderProps {
  baseUrl?: string;
  children?: ReactNode;
  path?: string;
  revalidateTag: (tag: string) => Promise<void>;
  sessionId: () => Promise<{
    value: string;
  }>;
}

interface NextRealtimeContextProps {
  isStreaming: boolean;
  startStreaming: () => void;
  stopStreaming: () => void;
  url: string;
}

const NextRealtimeContext = createContext<NextRealtimeContextProps | undefined>(
  undefined
);

export const useNextRealtimeContext = () => {
  const context = useContext(NextRealtimeContext);
  if (!context) {
    throw new Error(
      'useNextRealtimeContext must be used within a NextRealtimeProvider'
    );
  }
  return context;
};

export const NextRealtimeStreamProvider = (
  props: NextRealtimeProviderProps
) => {
  const [, startTransition] = useTransition();

  const [generatingId, startGeneratingIdTransition] = useTransition();
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  useEffect(() => {
    startGeneratingIdTransition(() => {
      props.sessionId?.()?.then((id) => {
        if (id && id.value) {
          console.log('Setting session id...', id.value);
          setSessionId(id.value);
        }
      });
    });
  }, []);

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

  const [id, setId] = useState(nanoid());

  const url = `${props.baseUrl || ''}/${props.path || `realtime`}?id=${id}`;

  const [isStreaming, setIsStreaming] = useState(true);

  const onDone = useCallback(() => {
    // TODO backoff and retry
    if (isStreaming) {
      startStreaming();
      console.log('Reconnecting to stream...');
    }
  }, [isStreaming]);

  const { close } = useStream(`${url}?id=${id}`, {
    onNext,
    onError,
    onDone,
  });

  const startStreaming = useCallback(() => {
    setIsStreaming(true);
    setId(nanoid());
    console.log('Starting stream...');
  }, []);

  const stopStreaming = useCallback(() => {
    setIsStreaming(false);
    close?.();
    console.log('Stopping stream...');
  }, []);

  const contextValue = useMemo(
    () => ({
      url,
      isStreaming,
      startStreaming,
      stopStreaming,
    }),
    [url, isStreaming]
  );

  return (
    <NextRealtimeContext.Provider value={contextValue}>
      {props.children}
    </NextRealtimeContext.Provider>
  );
};

// export interface NextRealtimePollingProps extends NextRealtimeProviderProps {
//   pollInterval?: number;
// }

// export const NextRealtimePolling = (props: NextRealtimePollingProps) => {
//   const isPageVisible = usePageVisibility();
//   const timerIdRef = useRef(null);
//   const [isPollingEnabled, setIsPollingEnabled] = useState(true);

//   useEffect(() => {
//     const pollingCallback = async () => {
//       const res = await fetch(
//         `${props.baseUrl || ''}/${props.path || `realtime`}`
//       );

//       if (res.status === 200) {
//         const data = await res.json();
//         if (data.tags) {
//           data.tags.forEach((tag: string) => {
//             props.revalidateTag(tag);
//           });
//         }
//       }

//       // Your polling logic here
//       console.log('Polling...');

//       setIsPollingEnabled(false);
//     };

//     const startPolling = () => {
//       pollingCallback(); // To immediately start fetching data
//       (timerIdRef as any).current = setInterval(
//         pollingCallback,
//         props.pollInterval || 1000
//       );
//     };

//     const stopPolling = () => {
//       clearInterval((timerIdRef as any).current);
//     };

//     if (isPageVisible && isPollingEnabled) {
//       startPolling();
//     } else {
//       stopPolling();
//     }

//     return () => {
//       stopPolling();
//     };
//   }, [isPageVisible, isPollingEnabled]);
// };

// export const usePageVisibility = () => {
//   const [isPageVisible, setIsPageVisible] = useState(!document.hidden);

//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       setIsPageVisible(!document.hidden);
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, []);

//   return isPageVisible;
// };
