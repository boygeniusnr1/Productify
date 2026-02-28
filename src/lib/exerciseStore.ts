import { persistentAtom } from '@nanostores/persistent';

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
    // DON'T set to empty {}. Set to the default starting values.
    exerciseStore.set({
      'ex-1': '0' 
    }); 
    lastResetDate.set(today);
  }
}