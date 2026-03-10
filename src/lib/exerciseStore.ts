import { map } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import { supabase } from './supabase';

export const lastResetDate = persistentAtom<string>('last-reset-date', '');

export interface Exercise {
  id: string;
  name: string;
  goal: number;
  current: number;
  unit: string;
}

// We store the whole array as a JSON string
export const exerciseList = persistentAtom<Exercise[]>('exercise-list-v1', [
  { id: '1', name: 'Pushups', goal: 50, current: 0, unit: 'reps' }
], {
  encode: JSON.stringify,
  decode: JSON.parse
});

export function addExercise(name: string, goal: number) {
  const newList = [...exerciseList.get(), {
    id: crypto.randomUUID(),
    name,
    goal,
    current: 0,
    unit: 'reps'
  }];
  exerciseList.set(newList);
}

export function updateExercise(id: string, newName: string, newGoal: number) {
  const list = exerciseList.get();
  exerciseList.set(list.map(ex => 
    ex.id === id ? { ...ex, name: newName, goal: newGoal } : ex
  ));
}

export function incrementExercise(id: string) {
  const list = exerciseList.get();
  exerciseList.set(list.map(ex => 
    ex.id === id ? { ...ex, current: ex.current + 1 } : ex
  ));
}

export function checkDailyReset() {
  const today = new Date().toLocaleDateString();
  const lastDate = lastResetDate.get();

  if (lastDate !== today) {
    // FIXED: Changed exerciseStore to exerciseList
    exerciseList.set([
       { id: '1', name: 'Pushups', goal: 50, current: 0, unit: 'reps' }
    ]); 
    lastResetDate.set(today);
  }
}

export async function syncExercise(exercise: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('exercises').upsert({
  id: exercise.id,
  user_id: user.id,
  name: exercise.name,
  goal: exercise.goal,
  current: exercise.current,
  last_updated: new Date().toISOString()
});
}

// FIXED: Changed exerciseStore to exerciseList
exerciseList.subscribe((exercises) => {
  if (exercises && exercises.length > 0) {
    exercises.forEach(ex => syncExercise(ex));
  }
});
export async function fetchExercises() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error("Error fetching exercises:", error.message);
    return;
  }

  if (data && data.length > 0) {
    const formatted = data.map(ex => ({
      id: ex.id,
      name: ex.name,
      goal: ex.goal,
      current: ex.current,
      unit: ex.unit || 'reps'
    }));
    exerciseList.set(formatted);
  }
}
export async function deleteExercise(id: string) {
  // 1. Remove from Local Store immediately (Optimistic UI)
  const updatedList = exerciseList.get().filter(ex => ex.id !== id);
  exerciseList.set(updatedList);

  // 2. Kill it in the Cloud
  const { error } = await supabase
    .from('exercises')
    .select('*') // Verify existence
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Cloud delete failed:", error.message);
    // Optional: Re-add it to the list if the cloud delete fails
  }
}