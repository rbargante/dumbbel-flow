import { useState, useCallback, useRef } from 'react';
import { AppData, DEFAULT_APP_DATA, WorkoutLog, ExerciseLog } from '@/data/exercises';
import { loadState, saveState } from '@/lib/storage';

export function useAppData() {
  const hydratedRef = useRef(false);

  const [data, setData] = useState<AppData>(() => {
    const persisted = loadState();
    if (persisted) {
      hydratedRef.current = true;
      return persisted;
    }
    return DEFAULT_APP_DATA;
  });

  const hydrated = hydratedRef.current || data !== DEFAULT_APP_DATA;

  const advanceDay = useCallback(() => {
    setData(prev => {
      const next = { ...prev, nextDayIndex: (prev.nextDayIndex + 1) % 3 };
      saveState(next);
      return next;
    });
  }, []);

  const saveWorkout = useCallback((workout: WorkoutLog) => {
    setData(prev => {
      const newLastSession = { ...prev.lastSessionByExercise };
      workout.exercises.forEach(ex => {
        const doneSets = ex.sets.filter(s => s.done);
        if (doneSets.length > 0) {
          newLastSession[ex.exerciseId] = doneSets;
        }
      });
      const next: AppData = {
        ...prev,
        workouts: [workout, ...prev.workouts],
        lastSessionByExercise: newLastSession,
        nextDayIndex: (prev.nextDayIndex + 1) % 3,
      };
      saveState(next);
      return next;
    });
  }, []);

  // Save current workout progress in real-time (updates lastSession live)
  const saveProgress = useCallback((exercises: ExerciseLog[]) => {
    setData(prev => {
      const newLastSession = { ...prev.lastSessionByExercise };
      // Don't update lastSession here - only on finish
      // Just persist current state
      const next = { ...prev };
      saveState(next);
      return prev; // No state change needed, just persist
    });
  }, []);

  const updateSettings = useCallback((settings: Partial<AppData['settings']>) => {
    setData(prev => {
      const next = { ...prev, settings: { ...prev.settings, ...settings } };
      saveState(next);
      return next;
    });
  }, []);

  const importData = useCallback((imported: AppData) => {
    const next = { ...DEFAULT_APP_DATA, ...imported };
    saveState(next);
    setData(next);
  }, []);

  const exportData = useCallback(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  return { data, hydrated, advanceDay, saveWorkout, saveProgress, updateSettings, importData, exportData };
}
