import { X } from 'lucide-react';

interface RestTimerBarProps {
  secondsLeft: number;
  onStop: () => void;
}

export function RestTimerBar({ secondsLeft, onStop }: RestTimerBarProps) {
  if (secondsLeft <= 0) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
      <span className="font-bold text-lg tracking-wider">
        REST: {mins}:{secs.toString().padStart(2, '0')}
      </span>
      <button onClick={onStop} className="p-1">
        <X size={20} />
      </button>
    </div>
  );
}
