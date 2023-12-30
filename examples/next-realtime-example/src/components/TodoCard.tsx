'use client';

import React, { useTransition } from 'react';
import { deleteTodo } from '../actions/deleteTodo';

export interface TodoCardProps {
  todo: any;
}

const formatDateTimeForHumans = (time: Date) => {
  const date = new Date(time);
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const TodoCard = (props: TodoCardProps) => {
  const [, startTransition] = useTransition();

  return (
    <div className="bg-white rounded-md overflow-hidden shadow-md p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-md font-semibold mb-4">{props.todo.text}</h2>
        <button
          className="bg-yellow-500 text-white font-semibold p-1 rounded focus:outline-none focus:shadow-outline-blue active:bg-yellow-600"
          type="button"
          onClick={() =>
            startTransition(() =>
              deleteTodo({
                id: props.todo.id,
              })
            )
          }
        >
          Delete
        </button>
      </div>
      <div className="flex justify-between">
        <div className="text-gray-400 text-sm">
          {formatDateTimeForHumans(props.todo.createdAt)}
        </div>
        <div className="text-gray-400 text-sm mr-2">{props.todo.id}</div>
      </div>
    </div>
  );
};

export default TodoCard;
