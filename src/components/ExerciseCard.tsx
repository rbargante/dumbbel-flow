import { useState } from 'react';
import { SetLog, EXERCISE_EQUIVALENTS } from '@/data/exercises';
import { Minus, Plus, X, RefreshCw, Trophy, Image, Check } from 'lucide-react';
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

const WEIGHT_PICKS = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];

export function ExerciseCard({
  name, exerciseId, setsCount, repRange, lastSession, currentSets, onSetChange, onSetDone, isBase, onRemove, onSwap, isPR, mediaUrl,
}: ExerciseCardProps) {
  const [showSwap, setShowSwap] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [editingWeightSet, setEditingWeightSet] = useState<number | null>(null);
  const [amrapSet, setAmrapSet] = useState<number | null>(null);
  const [amrapReps, setAmrapReps] = useState(0);

  const equivalents = EXERCISE_EQUIVALENTS[exerciseId] || [];

  // Check if repRange indicates AMRAP (contains '+' like '6-8+' or 'AMRAP')
  const isAmrap = (setIdx: number) => {
    // Last set is AMRAP if repRange contains '+'
    return repRange.includes('+') && setIdx === currentSets.length - 1;
  };

  const handleCircleTap = (i: number) => {
    const set = currentSets[i];
    if (set.done) {
      // Untoggle
      onSetDone(i);
      return;
    }
    if (isAmrap(i)) {
      // Open AMRAP modal
      setAmrapReps(set.reps || 8);
      setAmrapSet(i);
    } else {
      onSetDone(i);
    }
  };

  const confirmAmrap = () => {
    if (amrapSet !== null) {
      onSetChange(amrapSet, 'reps', amrapReps);
      // Small delay to ensure state updates then mark done
      setTimeout(() => onSetDone(amrapSet), 50);
      setAmrapSet(null);
    }
  };

  return (
    <div className="bg-card rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-foreground text-base">{name}</h3>
            {isPR && (
              <span className="flex items-center gap-1 bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                <Trophy size={10} />
                Best today
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{setsCount} × {repRange}</p>
        </div>
        <div className="flex items-center gap-1">
          {mediaUrl && (
            <button onClick={() => setShowMedia(!showMedia)} className="text-muted-foreground p-1">
              <Image size={16} />
            </button>
          )}
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
      {showMedia && mediaUrl && (
        <div className="rounded-lg overflow-hidden">
          <img src={mediaUrl} alt={name} className="w-full h-32 object-cover" />
        </div>
      )}

      {/* Set circles row — reps inside, weight below */}
      <div className="flex items-start justify-center gap-4 flex-wrap">
        {currentSets.map((set, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            {/* Circle */}
            <button
              onClick={() => handleCircleTap(i)}
              className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center transition-all border-2',
                set.done
                  ? 'bg-primary border-primary'
                  : 'bg-transparent border-muted-foreground/40'
              )}
            >
              {set.done ? (
                <Check size={24} className="text-primary-foreground" strokeWidth={3} />
              ) : (
                <span className="text-lg font-black text-foreground">{set.reps || '—'}</span>
              )}
            </button>

            {/* Per-set weight below circle — tappable to edit */}
            <button
              onClick={() => setEditingWeightSet(editingWeightSet === i ? null : i)}
              className={cn(
                'text-xs font-medium text-center leading-tight min-w-[40px] py-0.5 rounded',
                editingWeightSet === i ? 'bg-primary/20 text-primary' : 'text-muted-foreground'
              )}
            >
              {set.weight > 0 ? `${set.weight}kg` : '—'}
            </button>
          </div>
        ))}
      </div>

      {/* Per-set weight editor */}
      {editingWeightSet !== null && (
        <div className="bg-secondary rounded-lg p-3 space-y-3">
          <p className="text-xs text-muted-foreground font-semibold uppercase text-center">
            Set {editingWeightSet + 1} — Weight
          </p>

          {/* +/- 2kg stepper */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => onSetChange(editingWeightSet, 'weight', Math.max(0, currentSets[editingWeightSet].weight - 2))}
              className="w-10 h-10 rounded-full bg-card text-foreground flex items-center justify-center active:bg-primary/30"
            >
              <Minus size={18} />
            </button>
            <span className="text-2xl font-black text-foreground tabular-nums min-w-[70px] text-center">
              {currentSets[editingWeightSet].weight}<span className="text-sm text-muted-foreground ml-1">kg</span>
            </span>
            <button
              onClick={() => onSetChange(editingWeightSet, 'weight', Math.min(32, currentSets[editingWeightSet].weight + 2))}
              className="w-10 h-10 rounded-full bg-card text-foreground flex items-center justify-center active:bg-primary/30"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Quick picks grid */}
          <div className="grid grid-cols-8 gap-1">
            {WEIGHT_PICKS.map(w => (
              <button
                key={w}
                onClick={() => onSetChange(editingWeightSet, 'weight', w)}
                className={cn(
                  'py-1.5 rounded text-xs font-bold transition-colors',
                  currentSets[editingWeightSet].weight === w
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-foreground'
                )}
              >
                {w}
              </button>
            ))}
          </div>

          <button
            onClick={() => setEditingWeightSet(null)}
            className="w-full text-center text-xs text-muted-foreground py-1"
          >
            Done
          </button>
        </div>
      )}

      {/* AMRAP Modal */}
      {amrapSet !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70" onClick={() => setAmrapSet(null)}>
          <div className="bg-card rounded-xl p-6 w-72 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-black text-foreground text-center">AMRAP</h3>
            <p className="text-sm text-muted-foreground text-center">Enter reps achieved</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setAmrapReps(Math.max(1, amrapReps - 1))}
                className="w-12 h-12 rounded-full bg-secondary text-foreground flex items-center justify-center"
              >
                <Minus size={20} />
              </button>
              <span className="text-4xl font-black text-foreground tabular-nums min-w-[60px] text-center">
                {amrapReps}
              </span>
              <button
                onClick={() => setAmrapReps(amrapReps + 1)}
                className="w-12 h-12 rounded-full bg-secondary text-foreground flex items-center justify-center"
              >
                <Plus size={20} />
              </button>
            </div>
            <button
              onClick={confirmAmrap}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg text-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Last session reference */}
      {lastSession && lastSession.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Last: {lastSession.map((s, i) => `${s.weight}kg×${s.reps}`).join(' · ')}
        </p>
      )}
    </div>
  );
}
