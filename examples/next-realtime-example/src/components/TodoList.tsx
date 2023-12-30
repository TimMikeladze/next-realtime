import { getTodos } from '../actions/getTodos';
import { AddTodoButton } from './AddTodoButton';
import { ClearTodosButton } from './ClearTodosButton';
import TodoCard from './TodoCard';

const TodoList = async () => {
  const todos = await getTodos();

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Todo List</h1>
      <div className="flex items-center space-x-4 mb-4 flex-wrap">
        <AddTodoButton />
        <ClearTodosButton />
      </div>
      <div className="space-y-4">
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
};

export default TodoList;
