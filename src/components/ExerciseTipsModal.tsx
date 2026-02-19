import { X } from "lucide-react";
import { getExerciseCues } from "@/data/exerciseCues";

type ExerciseApiDetails = {
  name?: string;
  target?: string;
  secondaryMuscles?: string[];
  instructions?: string[];
  equipment?: string;
  bodyPart?: string;
  description?: string;
};

interface ExerciseTipsModalProps {
  exerciseName: string;
  onClose: () => void;

  // ✅ Se existir, mostramos detalhes vindos da API
  apiDetails?: ExerciseApiDetails | null;
}

export function ExerciseTipsModal({
  exerciseName,
  onClose,
  apiDetails,
}: ExerciseTipsModalProps) {
  const { cues, mistakes } = getExerciseCues(exerciseName);

  const hasApiInstructions =
    !!apiDetails?.instructions && apiDetails.instructions.length > 0;

  const title = apiDetails?.name || exerciseName;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl p-5 w-[340px] max-w-[92vw] space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground leading-tight pr-2">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-secondary text-muted-foreground active:bg-primary/20 shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* ✅ API DETAILS (preferência) */}
        {hasApiInstructions ? (
          <div className="space-y-3">
            {apiDetails?.target && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Target
                </p>
                <p className="text-sm text-foreground/90">{apiDetails.target}</p>
              </div>
            )}

            {apiDetails?.secondaryMuscles && apiDetails.secondaryMuscles.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Secondary Muscles
                </p>
                <p className="text-sm text-foreground/90">
                  {apiDetails.secondaryMuscles.join(", ")}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs text-primary uppercase tracking-wider font-semibold">
                Instructions
              </p>
              <ul className="space-y-1.5">
                {apiDetails.instructions!.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                    <span className="text-primary mt-0.5 shrink-0">•</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Fallback extra: se não houver cues locais, não mostramos mais nada.
                Se houver, podes manter cues como "Key Cues" abaixo das instructions (opcional). */}
            {cues?.length > 0 && (
              <div className="space-y-2 pt-1">
                <p className="text-xs text-primary uppercase tracking-wider font-semibold">
                  Key Cues
                </p>
                <ul className="space-y-1.5">
                  {cues.map((cue, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                      <span className="text-primary mt-0.5 shrink-0">•</span>
                      {cue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {mistakes && mistakes.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-destructive uppercase tracking-wider font-semibold">
                  Common Mistakes
                </p>
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
        ) : (
          /* ✅ FALLBACK: sem API, usa cues locais */
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs text-primary uppercase tracking-wider font-semibold">
                Key Cues
              </p>
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
                <p className="text-xs text-destructive uppercase tracking-wider font-semibold">
                  Common Mistakes
                </p>
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
        )}
      </div>
    </div>
  );
}