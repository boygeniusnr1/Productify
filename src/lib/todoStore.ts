import { persistentAtom } from '@nanostores/persistent';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  type: 'today' | 'tomorrow' | 'long-term';
  parentId?: string;
  dateAssigned?: string;
}

export const todoStore = persistentAtom<Todo[]>('todo-store', [], {
  encode: JSON.stringify,
  decode: (str) => {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }
});

export function addTodo(text: string, type: Todo['type'] = 'long-term', parentId?: string) {
  const newTodo: Todo = {
    id: crypto.randomUUID(),
    text,
    completed: false,
    type,
    parentId,
    dateAssigned: new Date().toISOString().split('T')[0]
  };
  todoStore.set([...todoStore.get(), newTodo]);
}

export function toggleTodo(id: string) {
  const todos = todoStore.get().map(t => 
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  todoStore.set(todos);
}

export function moveTodo(id: string, newType: Todo['type']) {
  const today = new Date().toISOString().split('T')[0];
  const todos = todoStore.get().map(t => {
    if (t.id === id || t.parentId === id) {
      return { ...t, type: newType, dateAssigned: today };
    }
    return t;
  });
  todoStore.set(todos);
}

export function deleteTodo(id: string) {
  const todos = todoStore.get().filter(t => t.id !== id && t.parentId !== id);
  todoStore.set(todos);
}

export function clearCompleted() {
  const activeTodos = todoStore.get().filter(t => !t.completed);
  todoStore.set(activeTodos);
}