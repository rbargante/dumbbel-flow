import { useState } from 'react';
import { SetLog, EXERCISE_EQUIVALENTS } from '@/data/exercises';
import { Minus, Plus, X, RefreshCw, Trophy, Image } from 'lucide-react';
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
  const [showMedia, setShowMedia] = useState(false);
  const [editingSet, setEditingSet] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<'weight' | 'reps' | null>(null);

  const equivalents = EXERCISE_EQUIVALENTS[exerciseId] || [];

  // Use the weight from the first set as the "global" weight display
  const currentWeight = currentSets[0]?.weight ?? 0;

  const adjustWeightAll = (delta: number) => {
    currentSets.forEach((set, i) => {
      if (!set.done) {
        onSetChange(i, 'weight', Math.max(0, Math.min(32, set.weight + delta)));
      }
    });
  };

  const adjustWeightSingle = (setIdx: number, delta: number) => {
    const newVal = Math.max(0, Math.min(32, currentSets[setIdx].weight + delta));
    onSetChange(setIdx, 'weight', newVal);
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

      {/* Weight control (global) */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => adjustWeightAll(-2)}
          className="w-10 h-10 rounded-full bg-secondary text-foreground flex items-center justify-center active:bg-primary/30 transition-colors"
        >
          <Minus size={18} />
        </button>
        <span className="text-2xl font-black text-foreground tabular-nums min-w-[80px] text-center">
          {currentWeight}<span className="text-sm text-muted-foreground ml-1">kg</span>
        </span>
        <button
          onClick={() => adjustWeightAll(2)}
          className="w-10 h-10 rounded-full bg-secondary text-foreground flex items-center justify-center active:bg-primary/30 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Large set circles */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {currentSets.map((set, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <button
              onClick={() => {
                if (editingSet === i) {
                  setEditingSet(null);
                  setEditingField(null);
                } else {
                  onSetDone(i);
                }
              }}
              className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center transition-all text-lg font-black border-2',
                set.done
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-transparent border-muted-foreground/40 text-muted-foreground'
              )}
            >
              {set.done ? '✓' : i + 1}
            </button>
            {/* Info below circle */}
            <button
              onClick={() => {
                setEditingSet(editingSet === i ? null : i);
                setEditingField(null);
              }}
              className="text-xs text-muted-foreground text-center leading-tight"
            >
              {set.done ? (
                <span className="text-primary font-semibold">{set.weight}kg×{set.reps}</span>
              ) : (
                <span>{set.weight > 0 ? `${set.weight}kg` : '—'}</span>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Per-set editor (shown when tapping info below circle) */}
      {editingSet !== null && (
        <div className="bg-secondary rounded-lg p-3 space-y-3">
          <p className="text-xs text-muted-foreground font-semibold uppercase text-center">
            Set {editingSet + 1}
          </p>

          {/* Weight for this set */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground w-12">Weight</span>
            <button
              onClick={() => adjustWeightSingle(editingSet, -2)}
              className="w-8 h-8 rounded-full bg-card text-foreground flex items-center justify-center"
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              inputMode="decimal"
              value={currentSets[editingSet].weight || ''}
              onChange={e => onSetChange(editingSet, 'weight', Math.min(32, parseFloat(e.target.value) || 0))}
              className="bg-card text-foreground text-center rounded-md px-1 py-1 text-sm w-16 outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={() => adjustWeightSingle(editingSet, 2)}
              className="w-8 h-8 rounded-full bg-card text-foreground flex items-center justify-center"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Reps for this set */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground w-12">Reps</span>
            <button
              onClick={() => onSetChange(editingSet, 'reps', Math.max(0, currentSets[editingSet].reps - 1))}
              className="w-8 h-8 rounded-full bg-card text-foreground flex items-center justify-center"
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              inputMode="numeric"
              value={currentSets[editingSet].reps || ''}
              onChange={e => onSetChange(editingSet, 'reps', parseInt(e.target.value) || 0)}
              className="bg-card text-foreground text-center rounded-md px-1 py-1 text-sm w-16 outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={() => onSetChange(editingSet, 'reps', currentSets[editingSet].reps + 1)}
              className="w-8 h-8 rounded-full bg-card text-foreground flex items-center justify-center"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            onClick={() => { setEditingSet(null); setEditingField(null); }}
            className="w-full text-center text-xs text-muted-foreground py-1"
          >
            Done
          </button>
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
