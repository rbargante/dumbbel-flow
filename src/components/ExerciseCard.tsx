import { useState } from 'react';
import { SetLog, EXERCISE_EQUIVALENTS } from '@/data/exercises';
import { Check, X, Minus, Plus, RefreshCw, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExerciseCardProps {
  name: string;
  exerciseId: string;
  setsCount: number;
  repRange: string;
  lastSession?: SetLog[];
  currentSets: SetLog[];
  onSetChange: (setIndex: number, field: 'weight' | 'reps', value: number) => void;
  onSetDone: (setIndex: number) => void;
  isBase: boolean;
  onRemove?: () => void;
  onSwap?: (altId: string, altName: string, altSets: number, altRepRange: string, altIsCompound: boolean) => void;
  isPR?: boolean;
  mediaUrl?: string;
}

export function ExerciseCard({
  name, exerciseId, setsCount, repRange, lastSession, currentSets, onSetChange, onSetDone, isBase, onRemove, onSwap, isPR, mediaUrl,
}: ExerciseCardProps) {
  const [showSwap, setShowSwap] = useState(false);
  const [editingWeight, setEditingWeight] = useState<number | null>(null);

  const equivalents = EXERCISE_EQUIVALENTS[exerciseId] || [];

  const adjustWeight = (setIdx: number, delta: number) => {
    const current = currentSets[setIdx].weight;
    const newVal = Math.max(0, current + delta);
    onSetChange(setIdx, 'weight', newVal);
  };

  return (
    <div className="bg-card rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-foreground">{name}</h3>
            {isPR && (
              <span className="flex items-center gap-1 bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                <Trophy size={12} />
                Best today
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{setsCount} × {repRange}</p>
        </div>
        <div className="flex items-center gap-1">
          {equivalents.length > 0 && onSwap && (
            <button onClick={() => setShowSwap(!showSwap)} className="text-muted-foreground p-1">
              <RefreshCw size={16} />
            </button>
          )}
          {!isBase && onRemove && (
            <button onClick={onRemove} className="text-muted-foreground p-1">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Swap panel */}
      {showSwap && equivalents.length > 0 && (
        <div className="bg-secondary rounded-lg p-3 space-y-2">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Swap with:</p>
          {equivalents.map(alt => (
            <button
              key={alt.id}
              onClick={() => {
                onSwap?.(alt.id, alt.name, alt.sets, alt.repRange, alt.isCompound);
                setShowSwap(false);
              }}
              className="w-full text-left p-2 rounded-md bg-card text-foreground text-sm font-medium"
            >
              {alt.name} — {alt.sets}×{alt.repRange}
            </button>
          ))}
        </div>
      )}

      {/* Media preview */}
      {mediaUrl && (
        <div className="rounded-lg overflow-hidden">
          <img src={mediaUrl} alt={name} className="w-full h-24 object-cover opacity-70" />
        </div>
      )}

      {/* Sets */}
      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-[32px_1fr_60px_32px] gap-2 text-xs text-muted-foreground px-1">
          <span />
          <span>Weight</span>
          <span className="text-center">Reps</span>
          <span />
        </div>

        {currentSets.map((set, i) => {
          const last = lastSession?.[i];
          return (
            <div key={i} className="space-y-1">
              {last && (
                <p className="text-xs text-muted-foreground px-1 pl-10">
                  Last: {last.weight}kg × {last.reps}
                </p>
              )}
              <div className="grid grid-cols-[32px_1fr_60px_32px] gap-2 items-center">
                {/* Set circle */}
                <button
                  onClick={() => onSetDone(i)}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center transition-colors text-xs font-bold',
                    set.done
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground'
                  )}
                >
                  {set.done ? <Check size={14} /> : i + 1}
                </button>

                {/* Weight stepper */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => adjustWeight(i, -2)}
                    className="w-7 h-7 rounded-md bg-secondary text-muted-foreground flex items-center justify-center active:bg-primary/30"
                  >
                    <Minus size={12} />
                  </button>
                  {editingWeight === i ? (
                    <input
                      type="number"
                      inputMode="decimal"
                      value={set.weight || ''}
                      onChange={e => onSetChange(i, 'weight', parseFloat(e.target.value) || 0)}
                      onBlur={() => setEditingWeight(null)}
                      autoFocus
                      className="bg-secondary text-foreground text-center rounded-md px-1 py-1 text-sm w-14 outline-none focus:ring-1 focus:ring-primary"
                    />
                  ) : (
                    <button
                      onClick={() => setEditingWeight(i)}
                      className="bg-secondary text-foreground text-center rounded-md px-1 py-1 text-sm w-14 font-medium"
                    >
                      {set.weight}<span className="text-xs text-muted-foreground ml-0.5">kg</span>
                    </button>
                  )}
                  <button
                    onClick={() => adjustWeight(i, 2)}
                    className="w-7 h-7 rounded-md bg-secondary text-muted-foreground flex items-center justify-center active:bg-primary/30"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Reps input */}
                <input
                  type="number"
                  inputMode="numeric"
                  value={set.reps || ''}
                  onChange={e => onSetChange(i, 'reps', parseInt(e.target.value) || 0)}
                  className="bg-secondary text-foreground text-center rounded-md px-2 py-1.5 text-sm w-full outline-none focus:ring-1 focus:ring-primary"
                  placeholder="0"
                />

                {/* Done indicator (small) */}
                {set.done && (
                  <span className="text-primary text-xs font-bold text-center">✓</span>
                )}
                {!set.done && <span />}
              </div>
              {/* Summary under circle when done */}
              {set.done && (
                <p className="text-xs text-primary font-medium pl-10">
                  {set.weight}kg × {set.reps}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
