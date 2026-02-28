import { persistentAtom } from '@nanostores/persistent';

export type ThemeColor = 'green' | 'blue' | 'purple' | 'orange';

export const colorMap = {
  green: '#22c55e',
  blue: '#3b82f6',
  purple: '#a855f7',
  orange: '#f97316'
};

// Ensure the key 'accent-color' matches what you use elsewhere
export const accentColor = persistentAtom<ThemeColor>('accent-color', 'green');