import { persistentAtom } from '@nanostores/persistent';

export const startTimeStore = persistentAtom<number>('timer-start', 0);

export function startTimer() {
  startTimeStore.set(Date.now());
}

export function stopTimer() {
  // Use a negative number or 0 to signify "OFF"
  startTimeStore.set(0);
  // Clear local storage key specifically to be sure
  localStorage.removeItem('timer-start'); 
}