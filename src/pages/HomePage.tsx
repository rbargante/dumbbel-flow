import { useState, useEffect } from 'react';
import { AppData, Program, DAY_NAMES, DAY_ORDER } from '@/data/exercises';
import { Dumbbell, ChevronRight, Download, Share2, Play, Lock, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface HomePageProps {
  data: AppData;
  onStartWorkout: () => void;
  onSelectProgram: (programId: string) => void;
  onContinueLastWorkout?: () => void;
  hasActiveSession?: boolean;
}

export function HomePage({ data, onStartWorkout, onSelectProgram, onContinueLastWorkout, hasActiveSession }: HomePageProps) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setInstallPrompt(null);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Ricardo Routine',
      text: 'Instala a minha app de treino Ricardo Routine',
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copiado' });
    }
  };

  const activeProgram = data.programs.find(p => p.isActive);
  const nextDayLabel = activeProgram
    ? activeProgram.workoutDays[data.nextDayIndex % activeProgram.workoutDays.length]
    : DAY_NAMES[DAY_ORDER[data.nextDayIndex]];

  return (
    <div className="px-4 pt-10 pb-24 max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <Dumbbell className="mx-auto text-primary" size={36} />
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Ricardo Routine
        </h1>
        <p className="text-muted-foreground text-xs">Choose your program</p>
      </div>

      {/* Programs */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Programs
        </p>

        {data.programs.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            nextDayLabel={
              program.isActive ? nextDayLabel : program.workoutDays[0]
            }
            onStart={() => {
              if (program.isActive) onSelectProgram(program.id);
            }}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Quick Actions
        </p>

        {/* Continue Last Workout */}
        {hasActiveSession && onContinueLastWorkout && (
          <button
            onClick={onContinueLastWorkout}
            className="w-full flex items-center justify-center gap-2 bg-card border border-primary text-primary font-bold py-3 rounded-xl active:scale-[0.98] transition-transform"
          >
            <RotateCcw size={18} /> Continue Last Workout
          </button>
        )}

        {/* Install & Share */}
        <div className="flex gap-3">
          {installPrompt && !installed ? (
            <button
              onClick={handleInstall}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3 rounded-xl active:scale-[0.98] transition-transform"
            >
              <Download size={18} /> Install App
            </button>
          ) : installed ? (
            <div className="flex-1 flex items-center justify-center gap-2 bg-card text-muted-foreground font-bold py-3 rounded-xl">
              <Download size={18} /> Installed
            </div>
          ) : null}
          <button
            onClick={handleShare}
            className={`${installPrompt || installed ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2 bg-card text-foreground font-bold py-3 rounded-xl active:scale-[0.98] transition-transform border border-secondary`}
          >
            <Share2 size={18} /> Share
          </button>
        </div>
      </div>

      {/* Workout count */}
      <div className="bg-card rounded-xl p-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Total workouts</p>
        <span className="text-2xl font-black text-primary">{data.workouts.length}</span>
      </div>
    </div>
  );
}

/* ─── Program Card ─── */

function ProgramCard({
  program,
  nextDayLabel,
  onStart,
}: {
  program: Program;
  nextDayLabel: string;
  onStart: () => void;
}) {
  const isActive = program.isActive;
  const isLocked = !!program.comingSoon;

  return (
    <div
      className={`bg-card rounded-xl p-4 space-y-3 transition-all ${
        isActive
          ? 'border-2 border-primary'
          : isLocked
          ? 'opacity-45 border border-secondary'
          : 'border border-secondary'
      }`}
    >
      {/* Top row */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-foreground truncate">
            {program.name}
          </h3>
          {isActive && (
            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
              ACTIVE
            </span>
          )}
          {isLocked && (
            <span className="bg-secondary text-muted-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0">
              Coming soon
            </span>
          )}
        </div>
        {/* Equipment tags */}
        <div className="flex gap-1.5 flex-wrap">
          {program.equipment.map(eq => (
            <span key={eq} className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-md">
              {eq}
            </span>
          ))}
        </div>
      </div>

      {/* Next workout & Start */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ChevronRight size={14} className="text-primary" />
          <span>
            {isLocked ? '—' : `Next: ${nextDayLabel}`}
          </span>
        </div>

        {isActive && !isLocked ? (
          <button
            onClick={(e) => { e.stopPropagation(); onStart(); }}
            className="flex items-center gap-1.5 bg-primary text-primary-foreground font-bold text-sm px-5 py-2.5 rounded-lg active:scale-[0.97] transition-transform"
          >
            <Play size={14} fill="currentColor" /> START
          </button>
        ) : isLocked ? (
          <Lock size={18} className="text-muted-foreground" />
        ) : null}
      </div>
    </div>
  );
}
