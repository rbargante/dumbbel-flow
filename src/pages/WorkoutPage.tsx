import { useState, useEffect, useRef } from 'react';
import {
  AppData, BASE_EXERCISES, EXTRA_EXERCISES, DAY_NAMES, DAY_ORDER,
  SetLog, ExerciseLog, WorkoutLog, Exercise,
} from '@/data/exercises';
import { ExerciseCard } from '@/components/ExerciseCard';
import { RestTimerBar } from '@/components/RestTimerBar';
import { useRestTimer } from '@/hooks/useRestTimer';
import { saveState } from '@/lib/storage';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkoutPageProps {
  data: AppData;
  onFinish: (workout: WorkoutLog) => void;
}

interface ActiveExercise {
  exercise: Exercise;
  isBase: boolean;
  sets: SetLog[];
}

function buildInitialSets(exerciseId: string, setsCount: number, lastSession: Record<string, SetLog[]>): SetLog[] {
  const last = lastSession[exerciseId];
  return Array.from({ length: setsCount }, (_, i) => {
    if (last && last[i]) {
      return { weight: last[i].weight, reps: last[i].reps, done: false };
    }
    return { weight: 0, reps: 0, done: false };
  });
}

export function WorkoutPage({ data, onFinish }: WorkoutPageProps) {
  const day = DAY_ORDER[data.nextDayIndex];
  const baseExercises = BASE_EXERCISES.filter(e => e.day === day);
  const timer = useRestTimer(data.settings.soundEnabled);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [exercises, setExercises] = useState<ActiveExercise[]>(() =>
    baseExercises.map(ex => ({
      exercise: ex,
      isBase: true,
      sets: buildInitialSets(ex.id, ex.sets, data.lastSessionByExercise),
    }))
  );

  const [showExtras, setShowExtras] = useState(false);
  const extras = EXTRA_EXERCISES[day];

  // Real-time save: debounce 500ms after any change
  const scheduleRealTimeSave = () => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveState(data);
    }, 500);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  const handleSetChange = (exIdx: number, setIdx: number, field: 'weight' | 'reps', value: number) => {
    setExercises(prev => {
      const copy = [...prev];
      const ex = { ...copy[exIdx], sets: [...copy[exIdx].sets] };
      ex.sets[setIdx] = { ...ex.sets[setIdx], [field]: value };
      copy[exIdx] = ex;
      return copy;
    });
    scheduleRealTimeSave();
  };

  const handleSetDone = (exIdx: number, setIdx: number) => {
    setExercises(prev => {
      const copy = [...prev];
      const ex = { ...copy[exIdx], sets: [...copy[exIdx].sets] };
      const wasDone = ex.sets[setIdx].done;
      ex.sets[setIdx] = { ...ex.sets[setIdx], done: !wasDone };
      copy[exIdx] = ex;

      if (!wasDone && data.settings.restTimerEnabled) {
        const seconds = copy[exIdx].exercise.isCompound ? 90 : 60;
        timer.start(seconds);
      }

      return copy;
    });
    scheduleRealTimeSave();
  };

  const addExtra = (extra: typeof extras[0]) => {
    const newEx: ActiveExercise = {
      exercise: {
        id: `${extra.id}_${Date.now()}`,
        name: extra.name,
        sets: extra.defaultSets,
        repRange: extra.repRange,
        isCompound: extra.isCompound,
        day,
      },
      isBase: false,
      sets: buildInitialSets(extra.id, extra.defaultSets, data.lastSessionByExercise),
    };
    setExercises(prev => [...prev, newEx]);
    setShowExtras(false);
  };

  const removeExercise = (idx: number) => {
    setExercises(prev => prev.filter((_, i) => i !== idx));
  };

  const finish = () => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    const workout: WorkoutLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      day,
      exercises: exercises.map(ex => ({
        exerciseId: ex.exercise.id,
        exerciseName: ex.exercise.name,
        sets: ex.sets,
      })),
    };
    timer.stop();
    onFinish(workout);
  };

  return (
    <div className={cn('px-4 pb-24 max-w-md mx-auto space-y-4', timer.isRunning ? 'pt-16' : 'pt-6')}>
      <RestTimerBar secondsLeft={timer.secondsLeft} onStop={timer.stop} />

      <h1 className="text-2xl font-black text-foreground">{DAY_NAMES[day]}</h1>

      {exercises.map((ex, i) => (
        <ExerciseCard
          key={ex.exercise.id}
          name={ex.exercise.name}
          setsCount={ex.exercise.sets}
          repRange={ex.exercise.repRange}
          lastSession={data.lastSessionByExercise[ex.exercise.id]}
          currentSets={ex.sets}
          onSetChange={(si, f, v) => handleSetChange(i, si, f, v)}
          onSetDone={(si) => handleSetDone(i, si)}
          isBase={ex.isBase}
          onRemove={ex.isBase ? undefined : () => removeExercise(i)}
        />
      ))}

      {/* Extras section */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-foreground mt-4">Extras</h2>
        {!showExtras ? (
          <button
            onClick={() => setShowExtras(true)}
            className="w-full bg-card rounded-xl p-4 flex items-center justify-center gap-2 text-muted-foreground"
          >
            <Plus size={20} />
            <span className="font-semibold">Add exercise</span>
          </button>
        ) : (
          <div className="bg-card rounded-xl p-4 space-y-2">
            {extras.map(ex => (
              <button
                key={ex.id}
                onClick={() => addExtra(ex)}
                className="w-full text-left p-3 rounded-lg bg-secondary text-foreground text-sm font-medium"
              >
                {ex.name} — {ex.defaultSets}×{ex.repRange}
              </button>
            ))}
            <button
              onClick={() => setShowExtras(false)}
              className="w-full text-center text-sm text-muted-foreground py-2"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Finish button */}
      <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
        <button
          onClick={finish}
          className="w-full bg-primary text-primary-foreground font-bold text-lg py-4 rounded-xl active:scale-[0.98] transition-transform"
        >
          FINISH WORKOUT
        </button>
      </div>
    </div>
  );
}
