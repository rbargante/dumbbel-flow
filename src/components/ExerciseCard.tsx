import { useState, useCallback, useRef } from 'react';
import { SetLog } from '@/data/exercises';
import { Plus, X, Trophy, Check } from 'lucide-react';
import { ExerciseTipsModal } from '@/components/ExerciseTipsModal';
import { ValuePickerModal } from '@/components/ValuePickerModal';
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
  isPR?: boolean;
}

const MAX_SETS = 10;

export function ExerciseCard({
  name, exerciseId, setsCount, repRange, lastSession, currentSets, onSetChange, onSetDone, onSetsCountChange, isBase, onRemove, isPR,
}: ExerciseCardProps) {
  const [showTips, setShowTips] = useState(false);

  // Picker state: which set and which field
  const [pickerTarget, setPickerTarget] = useState<{ setIdx: number; field: 'reps' | 'weight' } | null>(null);
  const [pickerValue, setPickerValue] = useState(0);

  // AMRAP
  const [amrapSet, setAmrapSet] = useState<number | null>(null);
  const [amrapReps, setAmrapReps] = useState(0);

  // Long-press handling
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggeredRef = useRef(false);

  const isAmrap = (setIdx: number) => {
    return repRange.includes('+') && setIdx === currentSets.length - 1;
  };

  const openPicker = (setIdx: number, field: 'reps' | 'weight') => {
    const set = currentSets[setIdx];
    setPickerValue(field === 'reps' ? (set.reps > 0 ? set.reps : 12) : set.weight);
    setPickerTarget({ setIdx, field });
  };

  const confirmPicker = () => {
    if (!pickerTarget) return;
    onSetChange(pickerTarget.setIdx, pickerTarget.field, pickerValue);
    setPickerTarget(null);
  };

  const handlePointerDown = useCallback((i: number) => {
    longPressTriggeredRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      const set = currentSets[i];
      if (!set.done) {
        openPicker(i, 'reps');
      }
    }, 500);
  }, [currentSets]);

  const handlePointerUpOrCancel = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleCircleTap = useCallback((i: number) => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }
    if (isAmrap(i) && !currentSets[i].done) {
      setAmrapReps(currentSets[i].reps || 8);
      setAmrapSet(i);
    } else {
      onSetDone(i);
    }
    setPickerTarget(null);
  }, [currentSets, onSetDone]);

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
    <div className="bg-card rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3
              className="font-bold text-foreground text-base active:text-primary cursor-pointer"
              onClick={() => setShowTips(true)}
            >
              {name}
            </h3>
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
          {!isBase && onRemove && (
            <button onClick={onRemove} className="text-muted-foreground p-1">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Set circles row */}
      <div className="flex items-start justify-center gap-4 flex-wrap">
        {currentSets.map((set, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <button
              onClick={() => handleCircleTap(i)}
              onPointerDown={() => handlePointerDown(i)}
              onPointerUp={handlePointerUpOrCancel}
              onPointerCancel={handlePointerUpOrCancel}
              onContextMenu={(e) => e.preventDefault()}
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
                <span className="text-lg font-black text-foreground">{set.reps > 0 ? set.reps : 12}</span>
              )}
            </button>

            <button
              onClick={() => openPicker(i, 'weight')}
              className="text-xs font-medium text-center leading-tight min-w-[40px] py-0.5 rounded text-muted-foreground"
            >
              {`${set.weight}kg`}
            </button>
          </div>
        ))}
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

      {/* Unified picker modal for reps or weight */}
      {pickerTarget && (
        <ValuePickerModal
          title={pickerTarget.field === 'reps' ? `Set ${pickerTarget.setIdx + 1} — Reps` : `Set ${pickerTarget.setIdx + 1} — Weight`}
          value={pickerValue}
          onChange={setPickerValue}
          onConfirm={confirmPicker}
          onCancel={() => setPickerTarget(null)}
          min={pickerTarget.field === 'reps' ? 1 : 0}
          max={pickerTarget.field === 'reps' ? 100 : 60}
          step={pickerTarget.field === 'reps' ? 1 : 2}
          suffix={pickerTarget.field === 'weight' ? 'kg' : undefined}
        />
      )}

      {/* AMRAP Modal — also uses unified picker */}
      {amrapSet !== null && (
        <ValuePickerModal
          title="AMRAP"
          subtitle="Enter reps achieved"
          value={amrapReps}
          onChange={setAmrapReps}
          onConfirm={confirmAmrap}
          onCancel={() => setAmrapSet(null)}
          min={1}
          max={100}
          step={1}
        />
      )}

      {/* Last session reference */}
      {lastSession && lastSession.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Last: {lastSession.map((s, i) => `${s.weight}kg×${s.reps}`).join(' · ')}
        </p>
      )}

      {/* Technique Tips Modal */}
      {showTips && (
        <ExerciseTipsModal exerciseName={name} onClose={() => setShowTips(false)} />
      )}
    </div>
  );
}
