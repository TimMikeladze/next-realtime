'use client';

import React, { useTransition, useState } from 'react';
import { nanoid } from 'nanoid';
import { addTodo } from '../actions/addTodo';

export const AddTodoButton = () => {
  const [, startTransition] = useTransition();
  const [todoText, setTodoText] = useState('');

  const handleInputChange = (e) => {
    setTodoText(e.target.value);
  };

  const handleAddTodo = () => {
    startTransition(() =>
      addTodo({
        text: todoText || `Random todo ${nanoid(4)}`,
      })
    );
    setTodoText(''); // Clear the input field after adding todo
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        value={todoText}
        onChange={handleInputChange}
        className="mr-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500 "
        placeholder="Enter todo"
      />
      <button
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-600"
        type="button"
        onClick={handleAddTodo}
      >
        Add todo
      </button>
    </div>
  );
};
