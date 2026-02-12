import { SetLog } from '@/data/exercises';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExerciseCardProps {
  name: string;
  setsCount: number;
  repRange: string;
  lastSession?: SetLog[];
  currentSets: SetLog[];
  onSetChange: (setIndex: number, field: 'weight' | 'reps', value: number) => void;
  onSetDone: (setIndex: number) => void;
  isBase: boolean;
  onRemove?: () => void;
}

export function ExerciseCard({
  name, setsCount, repRange, lastSession, currentSets, onSetChange, onSetDone, isBase, onRemove,
}: ExerciseCardProps) {
  return (
    <div className="bg-card rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{setsCount} × {repRange}</p>
        </div>
        {!isBase && onRemove && (
          <button onClick={onRemove} className="text-muted-foreground p-1">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-[1fr_60px_60px_40px] gap-2 text-xs text-muted-foreground px-1">
          <span>Set</span>
          <span className="text-center">kg</span>
          <span className="text-center">Reps</span>
          <span />
        </div>

        {currentSets.map((set, i) => {
          const last = lastSession?.[i];
          return (
            <div key={i} className="space-y-1">
              {last && (
                <p className="text-xs text-muted-foreground px-1">
                  Last: {last.weight}kg × {last.reps}
                </p>
              )}
              <div className="grid grid-cols-[1fr_60px_60px_40px] gap-2 items-center">
                <span className="text-sm text-muted-foreground px-1">Set {i + 1}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={set.weight || ''}
                  onChange={e => onSetChange(i, 'weight', parseFloat(e.target.value) || 0)}
                  className="bg-secondary text-foreground text-center rounded-md px-2 py-1.5 text-sm w-full outline-none focus:ring-1 focus:ring-primary"
                  placeholder="0"
                />
                <input
                  type="number"
                  inputMode="numeric"
                  value={set.reps || ''}
                  onChange={e => onSetChange(i, 'reps', parseInt(e.target.value) || 0)}
                  className="bg-secondary text-foreground text-center rounded-md px-2 py-1.5 text-sm w-full outline-none focus:ring-1 focus:ring-primary"
                  placeholder="0"
                />
                <button
                  onClick={() => onSetDone(i)}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                    set.done
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground'
                  )}
                >
                  <Check size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
