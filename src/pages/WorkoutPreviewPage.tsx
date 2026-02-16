import { ArrowLeft, Play, Clock, Dumbbell, Calendar } from 'lucide-react';
import { BASE_EXERCISES, PROGRAM_DAY_ORDERS, DAY_NAMES, WorkoutDay, Program, WorkoutLog } from '@/data/exercises';

interface WorkoutPreviewPageProps {
  program: Program;
  workouts: WorkoutLog[];
  onStart: () => void;
  onBack: () => void;
}

export function WorkoutPreviewPage({ program, workouts, onStart, onBack }: WorkoutPreviewPageProps) {
  const dayOrder = PROGRAM_DAY_ORDERS[program.id] || [];
  const exercises = BASE_EXERCISES.filter(e => e.programId === program.id);

  // Last workout for this program
  const lastWorkout = workouts.find(w => w.programId === program.id);
  const lastDate = lastWorkout
    ? new Date(lastWorkout.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  // Estimate total sets
  const totalSets = exercises.reduce((sum, e) => sum + e.sets, 0);
  // Rough time estimate: ~2 min per set + 1 min rest
  const estimatedMinutes = Math.round(totalSets * 2.5);

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 pt-6 pb-32 max-w-md mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg active:bg-secondary transition-colors"
          >
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-foreground truncate">{program.name}</h1>
            <p className="text-xs text-muted-foreground">Workout preview</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap">
          {program.equipment.map(eq => (
            <span key={eq} className="text-[11px] bg-secondary text-muted-foreground px-2.5 py-1 rounded-md font-medium">
              {eq}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-3 text-center border border-secondary">
            <Dumbbell size={16} className="mx-auto text-primary mb-1" />
            <p className="text-lg font-black text-foreground">{exercises.length}</p>
            <p className="text-[10px] text-muted-foreground">Exercises</p>
          </div>
          <div className="bg-card rounded-xl p-3 text-center border border-secondary">
            <Clock size={16} className="mx-auto text-primary mb-1" />
            <p className="text-lg font-black text-foreground">~{estimatedMinutes}</p>
            <p className="text-[10px] text-muted-foreground">Minutes</p>
          </div>
          <div className="bg-card rounded-xl p-3 text-center border border-secondary">
            <Calendar size={16} className="mx-auto text-primary mb-1" />
            <p className="text-lg font-black text-foreground">{dayOrder.length}</p>
            <p className="text-[10px] text-muted-foreground">Days</p>
          </div>
        </div>

        {/* Last workout */}
        {lastDate && (
          <div className="bg-card rounded-xl p-3.5 border border-secondary">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Last workout</p>
            <p className="text-sm font-bold text-foreground">{lastDate}</p>
            {lastWorkout?.day && (
              <p className="text-xs text-muted-foreground">{DAY_NAMES[lastWorkout.day]}</p>
            )}
          </div>
        )}

        {/* Exercise list per day */}
        {dayOrder.map((day) => {
          const dayExercises = exercises.filter(e => e.day === day);
          if (dayExercises.length === 0) return null;
          return (
            <div key={day} className="space-y-2">
              <p className="text-xs text-primary uppercase tracking-wider font-bold">
                {DAY_NAMES[day]}
              </p>
              <div className="bg-card rounded-xl border border-secondary divide-y divide-secondary">
                {dayExercises.map((ex, i) => (
                  <div key={ex.id} className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[10px] text-muted-foreground font-mono w-5 shrink-0">{i + 1}</span>
                      <span className="text-sm font-medium text-foreground truncate">{ex.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {ex.sets}×{ex.repRange}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed bottom START button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-secondary">
        <div className="max-w-md mx-auto">
          <button
            onClick={onStart}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-black text-base py-4 rounded-xl active:scale-[0.98] transition-transform"
          >
            <Play size={20} fill="currentColor" /> START WORKOUT
          </button>
        </div>
      </div>
    </div>
  );
}
