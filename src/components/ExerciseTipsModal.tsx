import { X } from 'lucide-react';
import { getExerciseCues } from '@/data/exerciseCues';

interface ExerciseTipsModalProps {
  exerciseName: string;
  onClose: () => void;
}

export function ExerciseTipsModal({ exerciseName, onClose }: ExerciseTipsModalProps) {
  const { cues, mistakes } = getExerciseCues(exerciseName);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85" onClick={onClose}>
      <div
        className="bg-card rounded-2xl p-5 w-[340px] max-w-[92vw] space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground leading-tight pr-2">{exerciseName}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-secondary text-muted-foreground active:bg-primary/20 shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-primary uppercase tracking-wider font-semibold">Key Cues</p>
          <ul className="space-y-1.5">
            {cues.map((cue, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                <span className="text-primary mt-0.5 shrink-0">•</span>
                {cue}
              </li>
            ))}
          </ul>
        </div>

        {mistakes && mistakes.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-destructive uppercase tracking-wider font-semibold">Common Mistakes</p>
            <ul className="space-y-1.5">
              {mistakes.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                  <span className="text-destructive mt-0.5 shrink-0">✕</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
