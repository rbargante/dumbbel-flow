import { X } from 'lucide-react';
import { ExerciseDemoAnimation } from '@/data/exerciseDemos';

interface ExerciseDemoModalProps {
  exerciseName: string;
  onClose: () => void;
}

export function ExerciseDemoModal({ exerciseName, onClose }: ExerciseDemoModalProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80" onClick={onClose}>
      <div
        className="bg-card rounded-2xl p-5 w-80 max-w-[90vw] space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground leading-tight pr-2">{exerciseName}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-secondary text-muted-foreground active:bg-primary/20"
          >
            <X size={18} />
          </button>
        </div>

        <div className="bg-secondary rounded-xl p-4 aspect-square flex items-center justify-center">
          <ExerciseDemoAnimation exerciseName={exerciseName} />
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Placeholder animation · Tap outside to close
        </p>
      </div>
    </div>
  );
}
