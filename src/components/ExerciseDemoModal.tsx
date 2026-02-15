import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { getExerciseCues } from '@/data/exerciseCues';
import { getExerciseDemo, CachedDemo } from '@/lib/demoCache';

interface ExerciseDemoModalProps {
  exerciseName: string;
  onClose: () => void;
}

export function ExerciseDemoModal({ exerciseName, onClose }: ExerciseDemoModalProps) {
  const { cues, mistakes } = getExerciseCues(exerciseName);
  const [demo, setDemo] = useState<CachedDemo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    getExerciseDemo(exerciseName)
      .then(result => {
        if (!cancelled) {
          setDemo(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [exerciseName]);

  const mediaUrl = demo?.cachedUrl || demo?.url;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85" onClick={onClose}>
      <div
        className="bg-card rounded-2xl p-5 w-[340px] max-w-[92vw] max-h-[85vh] overflow-y-auto space-y-4"
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

        {/* Demo Media */}
        {loading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 size={28} className="animate-spin text-primary" />
          </div>
        )}

        {!loading && demo && mediaUrl && (
          <div className="rounded-lg overflow-hidden bg-black">
            {demo.type === 'video' ? (
              <video
                src={mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full max-h-[200px] object-contain"
              />
            ) : (
              <img
                src={mediaUrl}
                alt={exerciseName}
                className="w-full max-h-[200px] object-contain"
                onError={() => setError(true)}
              />
            )}
          </div>
        )}

        {/* Key Cues */}
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

        {/* Common Mistakes */}
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
