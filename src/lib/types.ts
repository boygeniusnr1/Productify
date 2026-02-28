export interface ExerciseGoal {
  id: string;
  name: string;      // e.g., "Pushups"
  target: number;    // e.g., 50
  current: number;   // e.g., 12
  unit: string;      // e.g., "reps"
  lastUpdated: Date;
}