import { AppData, DEFAULT_APP_DATA, DEFAULT_PROGRAMS, SetLog } from '@/data/exercises';

const KEY = 'ricardo_routine_v2';
const OLD_KEY = 'ricardo_routine_state_v1';
const SESSION_KEY = 'ricardo_active_session';

// ─── Active Workout Session ───

export interface ActiveSession {
  programId: string;
  dayIndex: number;
  startedAt: number;
  exercises: {
    exerciseId: string;
    originalId: string;
    name: string;
    sets: number;
    repRange: string;
    isCompound: boolean;
    isBase: boolean;
    currentSets: SetLog[];
  }[];
}

export function saveActiveSession(session: ActiveSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadActiveSession(): ActiveSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && 'programId' in parsed && 'exercises' in parsed) {
      return parsed as ActiveSession;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearActiveSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// ─── App Data ───

export function loadState(): AppData | null {
  try {
    // Try new key first
    let raw = localStorage.getItem(KEY);
    
    // Migrate from old key if new key doesn't exist
    if (!raw) {
      raw = localStorage.getItem(OLD_KEY);
      if (raw) {
        // Migrate: save under new key and remove old
        localStorage.setItem(KEY, raw);
        localStorage.removeItem(OLD_KEY);
        localStorage.removeItem(OLD_KEY + '_last_saved');
      }
    }
    
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && 'nextDayIndex' in parsed) {
      const data = { ...DEFAULT_APP_DATA, ...parsed } as AppData;
      // Ensure programs array exists for legacy data
      if (!data.programs || data.programs.length === 0) {
        data.programs = DEFAULT_PROGRAMS;
      } else {
        // Merge any new programs from defaults that don't exist in saved data
        const savedIds = new Set(data.programs.map(p => p.id));
        for (const dp of DEFAULT_PROGRAMS) {
          if (!savedIds.has(dp.id)) {
            data.programs.push({ ...dp });
          }
        }
      }
      return data;
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
