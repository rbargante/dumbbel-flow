import { AppData, DEFAULT_APP_DATA } from '@/data/exercises';

const KEY = 'ricardo_routine_state_v1';

export function loadState(): AppData | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && 'nextDayIndex' in parsed) {
      return { ...DEFAULT_APP_DATA, ...parsed } as AppData;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveState(state: AppData): void {
  localStorage.setItem(KEY, JSON.stringify(state));
  localStorage.setItem(KEY + '_last_saved', new Date().toISOString());
}

export function getLastSaved(): string | null {
  return localStorage.getItem(KEY + '_last_saved');
}
