import { useState } from 'react';
import { WorkoutLog, DAY_NAMES } from '@/data/exercises';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface HistoryPageProps {
  workouts: WorkoutLog[];
}

export function HistoryPage({ workouts }: HistoryPageProps) {
  const [selected, setSelected] = useState<WorkoutLog | null>(null);

  if (selected) {
    return (
      <div className="px-4 pt-6 pb-24 max-w-md mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelected(null)} className="text-muted-foreground p-1">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black text-foreground">{DAY_NAMES[selected.day]}</h1>
            <p className="text-sm text-muted-foreground">
              {new Date(selected.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {selected.exercises.map(ex => (
          <div key={ex.exerciseId} className="bg-card rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-foreground">{ex.exerciseName}</h3>
            {ex.sets.map((set, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>Set {i + 1}:</span>
                <span className="text-foreground font-medium">{set.weight}kg × {set.reps}</span>
                {set.done && <span className="text-primary text-xs">✓</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 pt-12 pb-24 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-black text-foreground">History</h1>

      {workouts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No workouts yet</p>
          <p className="text-sm mt-1">Complete your first workout to see it here.</p>
        </div>
      ) : (
        workouts.map(w => (
          <button
            key={w.id}
            onClick={() => setSelected(w)}
            className="w-full bg-card rounded-xl p-4 flex items-center justify-between text-left"
          >
            <div>
              <p className="font-bold text-foreground">{DAY_NAMES[w.day]}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(w.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <ChevronRight className="text-muted-foreground" size={20} />
          </button>
        ))
      )}
    </div>
  );
}
