import { useState, useCallback, useEffect } from 'react';
import { AppData, DEFAULT_APP_DATA, WorkoutLog, SetLog } from '@/data/exercises';

const STORAGE_KEY = 'ricardo-routine-data';

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_APP_DATA, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_APP_DATA;
}

function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useAppData() {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const advanceDay = useCallback(() => {
    setData(prev => ({ ...prev, nextDayIndex: (prev.nextDayIndex + 1) % 3 }));
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
      return {
        ...prev,
        workouts: [workout, ...prev.workouts],
        lastSessionByExercise: newLastSession,
        nextDayIndex: (prev.nextDayIndex + 1) % 3,
      };
    });
  }, []);

  const updateSettings = useCallback((settings: Partial<AppData['settings']>) => {
    setData(prev => ({ ...prev, settings: { ...prev.settings, ...settings } }));
  }, []);

  const importData = useCallback((imported: AppData) => {
    setData({ ...DEFAULT_APP_DATA, ...imported });
  }, []);

  const exportData = useCallback(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  return { data, advanceDay, saveWorkout, updateSettings, importData, exportData };
}
