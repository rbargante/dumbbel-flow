import { AppData, Program } from "@/data/exercises";
import {
  Dumbbell,
  ChevronRight,
  Download,
  Share2,
  Play,
  Lock,
  RotateCcw,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

interface HomePageProps {
  data: AppData;
  onStartWorkout: () => void;
  onSelectProgram: (programId: string) => void;
  onContinueLastWorkout?: () => void;
  hasActiveSession?: boolean;
}

export function HomePage({
  data,
  onStartWorkout,
  onSelectProgram,
  onContinueLastWorkout,
  hasActiveSession,
}: HomePageProps) {
  const { installPrompt, isInstalled, promptInstall } = useInstallPrompt();

  const handleShare = async () => {
    const shareData = {
      title: "Ricardo Routine",
      text: "Check out Ricardo Routine — offline workout tracker",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied" });
    }
  };

  const activeProgram = data.programs.find((p) => p.isActive);

  const mainProgramsRaw = data.programs.filter(
    (p) => p.category === "main" && !p.id.includes("longevity")
  );

  const complementaryPrograms = data.programs.filter(
    (p) => p.category === "complementary" && p.id !== "balance_longevity"
  );

  // Keep original order (do NOT move active to top)
  const mainPrograms = mainProgramsRaw;

  return (
    <div className="px-4 pt-10 pb-24 max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <Dumbbell className="mx-auto text-primary" size={36} />
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Ricardo Routine
        </h1>
      </div>

      {/* Resume / Next Workout Card */}
      {(() => {
        if (hasActiveSession && onContinueLastWorkout) {
          return (
            <button
              onClick={onContinueLastWorkout}
              className="w-full bg-primary text-primary-foreground rounded-xl p-5 flex items-center justify-between active:scale-[0.98] transition-transform shadow-lg"
            >
              <div className="flex items-center gap-3">
                <RotateCcw size={22} />
                <div className="text-left">
                  <p className="font-black text-base">CONTINUE WORKOUT</p>
                  <p className="text-xs opacity-80">You have an active session</p>
                </div>
              </div>
              <ChevronRight size={20} />
            </button>
          );
        }

        if (activeProgram) {
          const nextDayLabel =
            activeProgram.workoutDays[
              data.nextDayIndex % activeProgram.workoutDays.length
            ];

          return (
            <button
              onClick={onStartWorkout}
              className="w-full bg-card border-2 border-primary rounded-xl p-5 flex items-center justify-between active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-3">
                <Play size={22} className="text-primary" fill="currentColor" />
                <div className="text-left">
                  <p className="font-black text-base text-foreground">
                    START NEXT WORKOUT
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activeProgram.name} — {nextDayLabel}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-primary" />
            </button>
          );
        }

        return null;
      })()}

      {/* Main Workouts */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Main Workouts
        </p>

        <div className="bg-card rounded-xl border border-secondary divide-y divide-secondary overflow-hidden">
          {mainPrograms.map((program) => (
            <ProgramRow
              key={program.id}
              program={program}
              onTap={() => onSelectProgram(program.id)}
            />
          ))}
        </div>
      </div>

      {/* Complementary */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Complementary
        </p>
        <div className="bg-card rounded-xl border border-secondary divide-y divide-secondary">
          {complementaryPrograms.map((program) => (
            <ProgramRow
              key={program.id}
              program={program}
              onTap={() => onSelectProgram(program.id)}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        {installPrompt && !isInstalled ? (
          <button
            onClick={promptInstall}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3 rounded-xl active:scale-[0.98] transition-transform"
          >
            <Download size={18} /> Install App
          </button>
        ) : isInstalled ? (
          <div className="flex-1 flex items-center justify-center gap-2 bg-card text-muted-foreground font-bold py-3 rounded-xl">
            <Download size={18} /> Installed
          </div>
        ) : null}

        <button
          onClick={handleShare}
          className={`${
            installPrompt || isInstalled ? "flex-1" : "w-full"
          } flex items-center justify-center gap-2 bg-card text-foreground font-bold py-3 rounded-xl active:scale-[0.98] transition-transform border border-secondary`}
        >
          <Share2 size={18} /> Share
        </button>
      </div>

      {/* Workout count */}
      <div className="bg-card rounded-xl p-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Total workouts</p>
        <span className="text-2xl font-black text-primary">
          {data.workouts.length}
        </span>
      </div>
    </div>
  );
}

/* ─── Program Row ─── */
function ProgramRow({
  program,
  onTap,
}: {
  program: Program;
  onTap: () => void;
}) {
  const isLocked = !!program.comingSoon;
  const isActive = !!program.isActive;

  return (
    <button
      onClick={() => !isLocked && onTap()}
      disabled={isLocked}
      className={`relative w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors active:bg-secondary/50 ${
        isLocked ? "opacity-45" : ""
      }`}
    >
      {/* Left red accent only for ACTIVE */}
      {isActive && (
        <span className="absolute left-0 top-0 h-full w-1 bg-primary" />
      )}

      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-semibold text-foreground truncate">
          {program.name}
        </span>

        {isActive && (
          <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
            ACTIVE
          </span>
        )}

        {isLocked && (
          <Lock size={14} className="text-muted-foreground shrink-0" />
        )}
      </div>

      <ChevronRight size={18} className="text-muted-foreground shrink-0" />
    </button>
  );
}