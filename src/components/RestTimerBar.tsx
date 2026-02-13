import { X, Minus, Plus } from 'lucide-react';

interface RestTimerBarProps {
  secondsLeft: number;
  totalSeconds: number;
  onStop: () => void;
  onAdjust: (delta: number) => void;
}

export function RestTimerBar({ secondsLeft, totalSeconds, onStop, onAdjust }: RestTimerBarProps) {
  if (secondsLeft <= 0) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onAdjust(-15)}
            className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs font-bold"
          >
            <Minus size={14} />
          </button>
          <span className="font-bold text-lg tracking-wider tabular-nums">
            {mins}:{secs.toString().padStart(2, '0')}
          </span>
          <button
            onClick={() => onAdjust(15)}
            className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs font-bold"
          >
            <Plus size={14} />
          </button>
        </div>
        <button onClick={onStop} className="p-1">
          <X size={20} />
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-1 bg-primary/40">
        <div
          className="h-full bg-primary-foreground transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
