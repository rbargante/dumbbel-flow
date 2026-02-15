import { useState, useRef, useCallback } from 'react';
import { SetLog, EXERCISE_EQUIVALENTS } from '@/data/exercises';
import { Minus, Plus, X, RefreshCw, Trophy, Image, Check, Undo2 } from 'lucide-react';
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
  onSetsCountChange?: (newCount: number) => void;
  isBase: boolean;
  onRemove?: () => void;
  onSwap?: (altId: string, altName: string, altSets: number, altRepRange: string, altIsCompound: boolean) => void;
  isSwapped?: boolean;
  originalName?: string;
  onRestore?: () => void;
  isPR?: boolean;
  mediaUrl?: string;
}

const WEIGHT_PICKS = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];
const MAX_SETS = 10;

export function ExerciseCard({
  name, exerciseId, setsCount, repRange, lastSession, currentSets, onSetChange, onSetDone, onSetsCountChange, isBase, onRemove, onSwap, isSwapped, originalName, onRestore, isPR, mediaUrl,
}: ExerciseCardProps) {
  const [showSwap, setShowSwap] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [editingWeightSet, setEditingWeightSet] = useState<number | null>(null);
  const [editingSet, setEditingSet] = useState<number | null>(null);
  const [editReps, setEditReps] = useState(0);
  const [editWeight, setEditWeight] = useState(0);
  const [amrapSet, setAmrapSet] = useState<number | null>(null);
  const [amrapReps, setAmrapReps] = useState(0);

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const equivalents = EXERCISE_EQUIVALENTS[exerciseId] || [];

  const isAmrap = (setIdx: number) => {
    return repRange.includes('+') && setIdx === currentSets.length - 1;
  };

  // Long-press handling for set circles
  const handlePointerDown = useCallback((i: number) => {
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      // Long-press on last circle = remove it
      if (i === currentSets.length - 1 && currentSets.length > 1 && onSetsCountChange) {
        onSetsCountChange(currentSets.length - 1);
      } else {
        const set = currentSets[i];
        setEditReps(set.reps || 5);
        setEditWeight(set.weight || 5);
        setEditingSet(i);
      }
    }, 500);
  }, [currentSets, onSetsCountChange]);

  const handlePointerUp = useCallback((i: number) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (didLongPress.current) {
      didLongPress.current = false;
      return; // long press handled
    }
    // Normal tap
    const set = currentSets[i];
    if (set.done) {
      onSetDone(i);
      return;
    }
    if (isAmrap(i)) {
      setAmrapReps(set.reps || 8);
      setAmrapSet(i);
    } else {
      onSetDone(i);
    }
  }, [currentSets, onSetDone]);

  const handlePointerLeave = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const confirmEditSet = () => {
    if (editingSet !== null) {
      onSetChange(editingSet, 'reps', editReps);
      onSetChange(editingSet, 'weight', editWeight);
      setEditingSet(null);
    }
  };

  const resetEditSet = () => {
    if (editingSet !== null) {
      setEditReps(0);
      setEditWeight(0);
    }
  };

  const confirmAmrap = () => {
    if (amrapSet !== null) {
      onSetChange(amrapSet, 'reps', amrapReps);
      setTimeout(() => onSetDone(amrapSet), 50);
      setAmrapSet(null);
    }
  };

  const handleAddSet = useCallback(() => {
    if (currentSets.length >= MAX_SETS || !onSetsCountChange) return;
    onSetsCountChange(currentSets.length + 1);
  }, [currentSets.length, onSetsCountChange]);

  return (
    <div className={cn("bg-card rounded-lg p-4 space-y-3", isSwapped && "ring-1 ring-primary/30")}>
      {/* Substitute badge */}
      {isSwapped && originalName && (
        <div className="flex items-center justify-between gap-2 bg-primary/10 rounded-md px-3 py-1.5">
          <p className="text-xs text-primary font-medium">
            <RefreshCw size={10} className="inline mr-1" />
            Substitute for <span className="font-bold">{originalName}</span>
          </p>
          {onRestore && (
            <button
              onClick={onRestore}
              className="flex items-center gap-1 text-xs font-bold text-primary active:opacity-70"
            >
              <Undo2 size={12} />
              Restore
            </button>
          )}
        </div>
      )}

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
          <p className="text-sm text-muted-foreground">{currentSets.length} × {repRange}</p>
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

      {/* Set circles row */}
      <div className="flex items-start justify-center gap-4 flex-wrap">
        {currentSets.map((set, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <button
              onPointerDown={() => handlePointerDown(i)}
              onPointerUp={() => handlePointerUp(i)}
              onPointerLeave={handlePointerLeave}
              className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center transition-all border-2 select-none touch-manipulation',
                set.done
                  ? 'bg-primary border-primary'
                  : 'bg-transparent border-muted-foreground/40'
              )}
            >
              {set.done ? (
                <Check size={24} className="text-primary-foreground" strokeWidth={3} />
              ) : (
                <span className="text-lg font-black text-foreground">{set.reps > 0 ? set.reps : 5}</span>
              )}
            </button>

            {/* Per-set weight below circle */}
            <button
              onClick={() => setEditingWeightSet(editingWeightSet === i ? null : i)}
              className={cn(
                'text-xs font-medium text-center leading-tight min-w-[40px] py-0.5 rounded',
                editingWeightSet === i ? 'bg-primary/20 text-primary' : 'text-muted-foreground'
              )}
            >
              {`${set.weight}kg`}
            </button>
          </div>
        ))}
        {/* + Add set button */}
        {onSetsCountChange && currentSets.length < MAX_SETS && (
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleAddSet}
              className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-dashed border-muted-foreground/30 text-muted-foreground active:border-primary active:text-primary transition-colors select-none touch-manipulation"
            >
              <Plus size={20} />
            </button>
            <span className="text-xs text-muted-foreground/50">Add</span>
          </div>
        )}
      </div>

      {/* Per-set weight editor */}
      {editingWeightSet !== null && (
        <div className="bg-secondary rounded-lg p-3 space-y-3">
          <p className="text-xs text-muted-foreground font-semibold uppercase text-center">
            Set {editingWeightSet + 1} — Weight
          </p>
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
          <button onClick={() => setEditingWeightSet(null)} className="w-full text-center text-xs text-muted-foreground py-1">Done</button>
        </div>
      )}

      {/* Long-press Edit Modal */}
      {editingSet !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70" onClick={() => setEditingSet(null)}>
          <div className="bg-card rounded-xl p-6 w-80 space-y-5" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-black text-foreground text-center">Edit Set {editingSet + 1}</h3>

            {/* Reps stepper */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-semibold uppercase text-center">Reps</p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setEditReps(Math.max(0, editReps - 1))}
                  className="w-12 h-12 rounded-full bg-secondary text-foreground flex items-center justify-center"
                >
                  <Minus size={20} />
                </button>
                <span className="text-4xl font-black text-foreground tabular-nums min-w-[60px] text-center">
                  {editReps || '—'}
                </span>
                <button
                  onClick={() => setEditReps(editReps + 1)}
                  className="w-12 h-12 rounded-full bg-secondary text-foreground flex items-center justify-center"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Weight stepper */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-semibold uppercase text-center">Weight</p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setEditWeight(Math.max(0, editWeight - 2))}
                  className="w-12 h-12 rounded-full bg-secondary text-foreground flex items-center justify-center"
                >
                  <Minus size={20} />
                </button>
                <span className="text-3xl font-black text-foreground tabular-nums min-w-[70px] text-center">
                  {editWeight}<span className="text-sm text-muted-foreground ml-1">kg</span>
                </span>
                <button
                  onClick={() => setEditWeight(Math.min(32, editWeight + 2))}
                  className="w-12 h-12 rounded-full bg-secondary text-foreground flex items-center justify-center"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="grid grid-cols-8 gap-1">
                {WEIGHT_PICKS.map(w => (
                  <button
                    key={w}
                    onClick={() => setEditWeight(w)}
                    className={cn(
                      'py-1.5 rounded text-xs font-bold transition-colors',
                      editWeight === w ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
                    )}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={resetEditSet}
                className="flex-1 bg-secondary text-muted-foreground font-bold py-3 rounded-lg text-sm"
              >
                Reset
              </button>
              <button
                onClick={confirmEditSet}
                className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-lg text-lg"
              >
                OK
              </button>
            </div>
          </div>
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
