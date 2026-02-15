import { useState, useEffect, useRef, useMemo } from 'react';
import {
  AppData, BASE_EXERCISES, EXTRA_EXERCISES, DAY_NAMES, DAY_ORDER, PROGRAM_DAY_ORDERS,
  SetLog, WorkoutLog, Exercise, WorkoutDay,
} from '@/data/exercises';
import { ExerciseCard } from '@/components/ExerciseCard';
import { RestTimerBar } from '@/components/RestTimerBar';
import { useRestTimer } from '@/hooks/useRestTimer';
import { saveState } from '@/lib/storage';
import { Plus, Timer, Dumbbell, Home, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkoutPageProps {
  data: AppData;
  programId: string;
  onFinish: (workout: WorkoutLog) => void;
  onHome?: () => void;
}

interface ActiveExercise {
  exercise: Exercise;
  isBase: boolean;
  sets: SetLog[];
  originalId: string;
}

function buildInitialSets(exerciseId: string, setsCount: number, lastSession: Record<string, SetLog[]>): SetLog[] {
  const last = lastSession[exerciseId];
  return Array.from({ length: setsCount }, (_, i) => {
    if (last && last[i]) {
      return { weight: last[i].weight, reps: last[i].reps, done: false };
    }
    return { weight: 5, reps: 5, done: false };
  });
}

export function WorkoutPage({ data, programId, onFinish, onHome }: WorkoutPageProps) {
  const dayOrder = PROGRAM_DAY_ORDERS[programId] || DAY_ORDER;
  const day = dayOrder[data.nextDayIndex % dayOrder.length];

  const baseExercises = BASE_EXERCISES.filter(e => e.day === day && e.programId === programId);
  const timer = useRestTimer(data.settings.soundEnabled);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [skipWarmup, setSkipWarmup] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const [exercises, setExercises] = useState<ActiveExercise[]>(() =>
    baseExercises.map(ex => ({
      exercise: ex,
      isBase: true,
      originalId: ex.id,
      sets: buildInitialSets(ex.id, ex.sets, data.lastSessionByExercise),
    }))
  );

  const [showExtras, setShowExtras] = useState(false);
  const extrasKey = `${programId}_${day}`;
  const extras = EXTRA_EXERCISES[extrasKey] || [];

  // Duration timer
  useEffect(() => {
    const iv = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const totalKg = useMemo(() => {
    return exercises.reduce((sum, ex) => {
      return sum + ex.sets.reduce((setSum, set) => {
        if (set.done && !(skipWarmup && set.isWarmup)) {
          return setSum + (set.weight * set.reps);
        }
        return setSum;
      }, 0);
    }, 0);
  }, [exercises, skipWarmup]);

  const prExercises = useMemo(() => {
    const prSet = new Set<string>();
    exercises.forEach(ex => {
      const maxWeightNow = Math.max(0, ...ex.sets.filter(s => s.done).map(s => s.weight));
      const lastSets = data.lastSessionByExercise[ex.originalId];
      const maxWeightLast = lastSets ? Math.max(0, ...lastSets.map(s => s.weight)) : 0;
      if (maxWeightNow > 0 && maxWeightNow > maxWeightLast) {
        prSet.add(ex.exercise.id);
      }
    });
    return prSet;
  }, [exercises, data.lastSessionByExercise]);

  const scheduleRealTimeSave = () => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveState(data);
    }, 500);
  };

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

  const handleSetsCountChange = (exIdx: number, newCount: number) => {
    setExercises(prev => {
      const copy = [...prev];
      const ex = { ...copy[exIdx] };
      const oldSets = [...ex.sets];

      if (newCount < oldSets.length) {
        ex.sets = oldSets.slice(0, newCount);
      } else {
        const lastWeight = oldSets.length > 0 ? oldSets[oldSets.length - 1].weight : 5;
        const lastReps = oldSets.length > 0 ? oldSets[oldSets.length - 1].reps : 5;
        const newSets = Array.from({ length: newCount - oldSets.length }, () => ({
          weight: lastWeight,
          reps: lastReps,
          done: false,
        }));
        ex.sets = [...oldSets, ...newSets];
      }

      copy[exIdx] = ex;
      return copy;
    });
    scheduleRealTimeSave();
  };




  const addExtra = (extra: typeof extras[0]) => {
    const exData: Exercise = {
      id: `${extra.id}_${Date.now()}`,
      name: extra.name,
      sets: extra.defaultSets,
      repRange: extra.repRange,
      isCompound: extra.isCompound,
      day,
      programId,
    };
    const newEx: ActiveExercise = {
      exercise: exData,
      isBase: false,
      originalId: extra.id,
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
    const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const workout: WorkoutLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      day,
      durationSeconds,
      totalKg,
      programId,
      exercises: exercises.map(ex => ({
        exerciseId: ex.originalId,
        exerciseName: ex.exercise.name,
        sets: ex.sets,
      })),
    };
    timer.stop();
    onFinish(workout);
  };

  const handleBack = () => {
    const hasDoneSets = exercises.some(ex => ex.sets.some(s => s.done));
    if (hasDoneSets) {
      setShowExitDialog(true);
    } else {
      // No progress, just leave
      timer.stop();
      onHome?.();
    }
  };

  const handleSaveAndExit = () => {
    finish();
  };

  const handleDiscard = () => {
    timer.stop();
    setShowExitDialog(false);
    onHome?.();
  };

  const totalExercises = exercises.length;

  return (
    <div className={cn('px-4 pb-24 max-w-md mx-auto space-y-4', timer.isRunning ? 'pt-16' : 'pt-6')}>
      <RestTimerBar
        secondsLeft={timer.secondsLeft}
        totalSeconds={timer.totalSeconds}
        onStop={timer.stop}
        onAdjust={timer.adjust}
        onSetDuration={timer.setDuration}
      />

      <div className="flex items-center justify-between">
        <button onClick={handleBack} className="p-2 -ml-2 rounded-lg active:bg-secondary transition-colors">
          <ArrowLeft size={20} className="text-muted-foreground" />
        </button>
        <h1 className="text-2xl font-black text-foreground">{DAY_NAMES[day]}</h1>
        <div />
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Timer size={14} className="text-primary" />
          <span className="tabular-nums font-medium text-foreground">{formatDuration(elapsed)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Dumbbell size={14} className="text-primary" />
          <span className="tabular-nums font-medium text-foreground">{totalKg.toLocaleString()} kg</span>
        </div>
        <button
          onClick={() => setSkipWarmup(!skipWarmup)}
          className={cn(
            'ml-auto text-xs px-2 py-1 rounded-md transition-colors',
            skipWarmup ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
          )}
        >
          Skip warmup
        </button>
      </div>

      {exercises.map((ex, i) => (
        <div key={ex.exercise.id}>
          {/* Progress indicator */}
          <p className="text-[10px] text-muted-foreground mb-1 font-medium">
            Exercise {i + 1} of {totalExercises}
          </p>
          <ExerciseCard
            name={ex.exercise.name}
            exerciseId={ex.originalId}
            setsCount={ex.exercise.sets}
            repRange={ex.exercise.repRange}
            lastSession={data.lastSessionByExercise[ex.originalId]}
            currentSets={ex.sets}
            onSetChange={(si, f, v) => handleSetChange(i, si, f, v)}
            onSetDone={(si) => handleSetDone(i, si)}
            onSetsCountChange={(count) => handleSetsCountChange(i, count)}
            isBase={ex.isBase}
            onRemove={ex.isBase ? undefined : () => removeExercise(i)}
            isPR={prExercises.has(ex.exercise.id)}
            mediaUrl={ex.exercise.mediaUrl}
          />
        </div>
      ))}

      {/* Extras section */}
      {extras.length > 0 && (
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
      )}

      {/* Finish button */}
      <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
        <button
          onClick={finish}
          className="w-full bg-primary text-primary-foreground font-bold text-lg py-4 rounded-xl active:scale-[0.98] transition-transform"
        >
          FINISH WORKOUT
        </button>
      </div>

      {/* Exit confirmation dialog */}
      {showExitDialog && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70" onClick={() => setShowExitDialog(false)}>
          <div className="bg-card rounded-xl p-6 w-80 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-black text-foreground text-center">Leave Workout?</h3>
            <p className="text-sm text-muted-foreground text-center">You have completed sets. What would you like to do?</p>
            <div className="space-y-2">
              <button
                onClick={handleSaveAndExit}
                className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg"
              >
                Save & Exit
              </button>
              <button
                onClick={handleDiscard}
                className="w-full bg-secondary text-foreground font-bold py-3 rounded-lg"
              >
                Discard
              </button>
              <button
                onClick={() => setShowExitDialog(false)}
                className="w-full text-center text-sm text-muted-foreground py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
