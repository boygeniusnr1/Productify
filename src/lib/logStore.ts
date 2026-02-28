import { persistentAtom } from '@nanostores/persistent';

export interface LogEntry {
  id: string;
  name: string;
  duration: string;
  timestamp: string;
}

// We use JSON encoding so we can store a complex array in LocalStorage
export const logStore = persistentAtom<LogEntry[]>('activity-logs', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function addLog(activity: string, duration: string) {
  const newLog = {
    id: crypto.randomUUID(),
    activity: activity, // IF THIS SAYS 'name' INSTEAD OF 'activity', 
                        // THE DASHBOARD WILL SHOW UNDEFINED
    duration: duration,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  logStore.set([...logStore.get(), newLog]);
}