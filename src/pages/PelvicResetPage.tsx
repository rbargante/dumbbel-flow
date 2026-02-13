import { useState } from 'react';
import { PELVIC_RESET_EXERCISES } from '@/data/exercises';
import { ArrowLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PelvicResetPageProps {
  onStart: () => void;
  onBack: () => void;
}

export function PelvicResetPage({ onStart, onBack }: PelvicResetPageProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const allDone = PELVIC_RESET_EXERCISES.every(ex => checked[ex.id]);

  const toggle = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="px-4 pt-6 pb-24 max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-muted-foreground p-1">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-black text-foreground">Pelvic Reset</h1>
      </div>

      <p className="text-sm text-muted-foreground">
        Complete all activation exercises before starting your workout.
      </p>

      <div className="space-y-3">
        {PELVIC_RESET_EXERCISES.map(ex => (
          <button
            key={ex.id}
            onClick={() => toggle(ex.id)}
            className={cn(
              'w-full bg-card rounded-xl p-4 flex items-center gap-4 text-left transition-colors',
              checked[ex.id] && 'ring-1 ring-primary'
            )}
          >
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
              checked[ex.id] ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
            )}>
              <Check size={16} />
            </div>
            <div>
              <p className="font-bold text-foreground">{ex.name}</p>
              <p className="text-sm text-muted-foreground">{ex.detail}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <button
          onClick={onStart}
          disabled={!allDone}
          className={cn(
            'w-full font-bold text-lg py-4 rounded-xl transition-all',
            allDone
              ? 'bg-primary text-primary-foreground active:scale-[0.98]'
              : 'bg-secondary text-muted-foreground cursor-not-allowed'
          )}
        >
          START MAIN WORKOUT
        </button>

        <button
          onClick={onStart}
          className="w-full text-center text-sm text-muted-foreground py-3 font-medium"
        >
          Skip Warmup
        </button>
      </div>
    </div>
  );
}
