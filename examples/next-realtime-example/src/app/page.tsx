import { TodoList } from '@/components/TodoList';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return <TodoList />;
}
