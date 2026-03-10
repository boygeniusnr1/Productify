import { persistentAtom } from '@nanostores/persistent';
import { supabase } from './supabase';

// We use JSON encoding so we can store a complex array in LocalStorage
export const logStore = persistentAtom<LogEntry[]>('activity-logs', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export interface LogEntry {
  id: string;
  activity: string; // Changed from 'name'
  duration: string;
  timestamp: string;
}

export function addLog(activity: string, duration: string) {
  const newLog: LogEntry = {
    id: crypto.randomUUID(),
    activity: activity,
    duration: duration,
    timestamp: new Date().toISOString() // Use ISO for easier DB sorting later
  };
  const currentLogs = logStore.get();
  logStore.set([...currentLogs, newLog]);
}
export async function syncLog(log: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

await supabase.from('logs').upsert({
    id: log.id,
    user_id: user.id,
    activity: log.activity, // FIXED: was log.name
    duration: log.duration, // FIXED: was log.reps
    created_at: log.timestamp // FIXED: was log.date
  });
}

logStore.subscribe((logs) => {
  // We only sync the most recent log to avoid heavy API usage
  if (logs.length > 0) {
    syncLog(logs[logs.length - 1]);
  }
});

export async function fetchLogs() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .eq('user_id', user.id);

  if (data) {
    const formatted: LogEntry[] = data.map(l => ({
      id: l.id,
      activity: l.activity || "Unknown", 
      duration: l.duration || "0",
      timestamp: l.created_at
    }));
    logStore.set(formatted);
  }
}
export async function deleteLog(id: string) {
  const updatedLogs = logStore.get().filter(log => log.id !== id);
  logStore.set(updatedLogs);

  const { error } = await supabase
    .from('logs')
    .delete()
    .eq('id', id);

  if (error) console.error("Log delete failed:", error.message);
}
export async function clearAllLogs() {
  const { data: { user } } = await supabase.auth.getUser();
  
  // 1. FORCED LOCAL WIPE: This clears the browser's persistent storage immediately
  logStore.set([]); 
  
  if (!user) {
    console.warn("No user found, only local logs cleared.");
    return;
  }

  // 2. CLOUD WIPE: Target all logs for this user
  const { error } = await supabase
    .from('logs')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error("Cloud wipe failed:", error.message);
  }
}