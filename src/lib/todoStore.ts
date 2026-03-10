import { persistentAtom } from '@nanostores/persistent';
import { supabase } from './supabase';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  type: 'today' | 'tomorrow' | 'long-term';
  parentId?: string; // <--- The "?" is vital. It can be a string OR undefined.
  dateAssigned?: string;
  user_id?: string;
}

export const todoStore = persistentAtom<Todo[]>('todo-store', [], {
  encode: JSON.stringify,
  decode: JSON.parse
});

// --- CLOUD SYNC LOGIC ---
export async function syncTodo(todo: Todo) {
const { data: { user } } = await supabase.auth.getUser();
if (!user) return;

const payload = {
  id: todo.id,
  user_id: user.id,
  text: todo.text,
  completed: todo.completed,
  type: todo.type,
  parent_id: todo.parentId || null, // Convert 'undefined' to 'null' for the Database
  date_assigned: todo.dateAssigned
};

await supabase.from('todos').upsert(payload);

  const { error } = await supabase
    .from('todos')
    .upsert(payload, { onConflict: 'id' });

  if (error) {
    console.error("Cloud Sync Error:", error.message);
  }
}

// --- UPDATED ACTIONS ---
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
  syncTodo(newTodo); // Push to cloud
}

export function toggleTodo(id: string) {
  const todos = todoStore.get().map(t => {
    if (t.id === id) {
      const updated = { ...t, completed: !t.completed };
      syncTodo(updated); // Push update to cloud
      return updated;
    }
    return t;
  });
  todoStore.set(todos);
}

export async function deleteTodo(id: string) {
  const todos = todoStore.get().filter(t => t.id !== id && t.parentId !== id);
  todoStore.set(todos);
  
  // Delete from cloud
  await supabase.from('todos').delete().eq('id', id);
}
export async function fetchTodos() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error("Fetch Error:", error.message);
    return;
  }

  if (data) {
    // CRITICAL: Map every single DB field back to your JS property names
    const formattedTodos = data.map(t => ({
      id: t.id,
      text: t.text,
      completed: t.completed,
      type: t.type,
      parentId: t.parent_id,    // Comma added
      dateAssigned: t.date_assigned,
      user_id: t.user_id        // Comma added
    }));
    
    todoStore.set(formattedTodos);
  }
}
export function moveTodo(id: string, newType: Todo['type']) {
  const todos = todoStore.get().map(t => {
    if (t.id === id) {
      const updated = { ...t, type: newType };
      syncTodo(updated); // Keep the cloud in sync
      return updated;
    }
    return t;
  });
  todoStore.set(todos);
}
export function clearCompleted() {
  const todos = todoStore.get().filter(t => !t.completed);
  todoStore.set(todos);
  
  // Optional: Add logic here later to delete from Supabase too
  // supabase.from('todos').delete().eq('completed', true);
}