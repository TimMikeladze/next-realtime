'use client';

import { useNextRealtimeContext } from 'next-realtime/react';

export const RealtimeButton = () => {
  const { isStreaming, startStreaming, stopStreaming } =
    useNextRealtimeContext();

  return (
    <button
      className={`${
        isStreaming ? 'bg-red-500' : 'bg-green-500'
      } text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-green active:bg-green-600`}
      type="button"
      onClick={() => {
        if (isStreaming) {
          stopStreaming();
        } else {
          startStreaming();
        }
      }}
    >
      {isStreaming ? 'Stop realtime' : 'Start realtime'}
    </button>
  );
};
