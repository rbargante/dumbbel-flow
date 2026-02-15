import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { getExerciseDemo, DemoResult } from '@/lib/demoCache';

interface ExerciseDemoModalProps {
  exerciseName: string;
  onClose: () => void;
}

// Coaching cues for offline fallback (no ugly placeholders)
const EXERCISE_CUES: Record<string, string[]> = {
  default: ['Control the movement', 'Breathe steadily', 'Full range of motion'],
};

export function ExerciseDemoModal({ exerciseName, onClose }: ExerciseDemoModalProps) {
  const [demo, setDemo] = useState<DemoResult | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getExerciseDemo(exerciseName).then(result => {
      if (!cancelled) {
        setDemo(result);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setDemo(null);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [exerciseName]);

  const cues = EXERCISE_CUES[exerciseName.toLowerCase()] || EXERCISE_CUES.default;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85" onClick={onClose}>
      <div
        className="bg-card rounded-2xl p-4 w-[340px] max-w-[92vw] space-y-3"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground leading-tight pr-2">{exerciseName}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-secondary text-muted-foreground active:bg-primary/20 shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        <div className="bg-secondary rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center">
          {loading ? (
            <Loader2 size={32} className="text-primary animate-spin" />
          ) : demo?.type === 'video' ? (
            <video
              src={demo.url}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain rounded-lg"
            />
          ) : demo?.type === 'image' ? (
            <img
              src={demo.url}
              alt={exerciseName}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            /* Clean fallback: exercise cues, no ugly graphics */
            <div className="p-4 text-center space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Key Cues</p>
              {cues.map((cue, i) => (
                <p key={i} className="text-sm text-foreground/80">{cue}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
