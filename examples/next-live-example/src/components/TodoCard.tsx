// TodoListCard.js
import React from 'react';

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

const TodoCard = (props: TodoCardProps) => (
  <div className="bg-white rounded-md overflow-hidden shadow-md p-4">
    <h2 className="text-lg font-semibold mb-2">{props.todo.text}</h2>
    <div className="flex justify-between">
      <div className="text-gray-400 text-sm">
        {formatDateTimeForHumans(props.todo.createdAt)}
      </div>
      <div className="text-gray-400 text-sm mr-2">{props.todo.id}</div>

      {/* Add additional content or actions here */}
    </div>
  </div>
);

export default TodoCard;
