import { X, Minus, Plus } from 'lucide-react';

interface RestTimerBarProps {
  secondsLeft: number;
  totalSeconds: number;
  onStop: () => void;
  onAdjust: (delta: number) => void;
  onSetDuration?: (seconds: number) => void;
}

export function RestTimerBar({ secondsLeft, totalSeconds, onStop, onAdjust, onSetDuration }: RestTimerBarProps) {
  if (secondsLeft <= 0) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-primary text-primary-foreground px-4 py-2 space-y-2">
        <div className="flex items-center justify-between">
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
          <div className="flex items-center gap-2">
            <button
              onClick={onStop}
              className="px-3 py-1 rounded-full bg-primary-foreground/20 text-xs font-bold"
            >
              Skip
            </button>
            <button onClick={onStop} className="p-1">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Easy / Hard quick picks */}
        {onSetDuration && (
          <div className="flex items-center gap-2 justify-center">
            <button
              onClick={() => onSetDuration(90)}
              className="px-3 py-1 rounded-full bg-primary-foreground/20 text-xs font-bold"
            >
              Easy 1:30
            </button>
            <button
              onClick={() => onSetDuration(180)}
              className="px-3 py-1 rounded-full bg-primary-foreground/20 text-xs font-bold"
            >
              Hard 3:00
            </button>
          </div>
        )}
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
