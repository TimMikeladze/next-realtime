// ClearTodosButton.js

'use client';

import { useTransition } from 'react';
import { clearTodos } from '../actions/clearTodos';

export const ClearTodosButton = () => {
  const [, startTransition] = useTransition();

  return (
    <button
      className="bg-red-500 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-red active:bg-red-600"
      type="button"
      onClick={() => startTransition(() => clearTodos())}
    >
      Clear todos
    </button>
  );
};
