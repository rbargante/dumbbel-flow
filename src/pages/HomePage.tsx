import { useState, useEffect } from 'react';
import { AppData, Program, DAY_NAMES, DAY_ORDER, PROGRAM_DAY_ORDERS } from '@/data/exercises';
import { Dumbbell, ChevronRight, Download, Share2, Play, Lock, RotateCcw, Grip, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

interface HomePageProps {
  data: AppData;
  onStartWorkout: () => void;
  onSelectProgram: (programId: string) => void;
  onContinueLastWorkout?: () => void;
  hasActiveSession?: boolean;
}

function getEquipmentIcon(equipment: string[]) {
  const first = equipment[0]?.toLowerCase() || '';
  if (first.includes('ez')) return <Grip size={18} className="text-primary" />;
  if (first.includes('full home') || first.includes('ironmaster')) return <Dumbbell size={18} className="text-primary" />;
  if (first.includes('bodyweight')) return <Activity size={18} className="text-primary" />;
  return <Dumbbell size={18} className="text-primary" />;
}

export function HomePage({ data, onStartWorkout, onSelectProgram, onContinueLastWorkout, hasActiveSession }: HomePageProps) {
  const { installPrompt, isInstalled, promptInstall } = useInstallPrompt();

  const handleShare = async () => {
    const shareData = {
      title: 'Ricardo Routine',
      text: 'Check out Ricardo Routine — offline workout tracker',
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copied' });
    }
  };

  const activeProgram = data.programs.find(p => p.isActive);

  const mainPrograms = data.programs.filter(p => p.category === 'main');
  const complementaryPrograms = data.programs.filter(p => p.category === 'complementary' && p.id !== 'balance_longevity');
  

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
          const nextDayLabel = activeProgram.workoutDays[data.nextDayIndex % activeProgram.workoutDays.length];
          return (
            <button
              onClick={() => onSelectProgram(activeProgram.id)}
              className="w-full bg-card border-2 border-primary rounded-xl p-5 flex items-center justify-between active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-3">
                <Play size={22} className="text-primary" fill="currentColor" />
                <div className="text-left">
                  <p className="font-black text-base text-foreground">START NEXT WORKOUT</p>
                  <p className="text-xs text-muted-foreground">{activeProgram.name} — {nextDayLabel}</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-primary" />
            </button>
          );
        }
        return null;
      })()}

      {/* Main Workouts */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Main Workouts
        </p>
        {mainPrograms.map((program) => {
          const dayOrder = PROGRAM_DAY_ORDERS[program.id] || ['push'];
          const nextDayLabel = program.isActive
            ? program.workoutDays[data.nextDayIndex % program.workoutDays.length]
            : program.workoutDays[0];
          return (
            <ProgramCard
              key={program.id}
              program={program}
              nextDayLabel={nextDayLabel}
              onStart={() => onSelectProgram(program.id)}
            />
          );
        })}
      </div>

      {/* Complementary */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Complementary
        </p>
        {complementaryPrograms.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            nextDayLabel={program.workoutDays[0]}
            onStart={() => onSelectProgram(program.id)}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">

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
            className={`${installPrompt || isInstalled ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2 bg-card text-foreground font-bold py-3 rounded-xl active:scale-[0.98] transition-transform border border-secondary`}
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
  icon,
}: {
  program: Program;
  nextDayLabel: string;
  onStart: () => void;
  icon?: React.ReactNode;
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
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          {icon || getEquipmentIcon(program.equipment)}
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
        <div className="flex gap-1.5 flex-wrap ml-[26px]">
          {program.equipment.map(eq => (
            <span key={eq} className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-md">
              {eq}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ChevronRight size={14} className="text-primary" />
          <span>
            {isLocked ? '—' : `Next: ${nextDayLabel}`}
          </span>
        </div>

        {!isLocked ? (
          <button
            onClick={(e) => { e.stopPropagation(); onStart(); }}
            className="flex items-center gap-1.5 bg-primary text-primary-foreground font-bold text-sm px-5 py-2.5 rounded-lg active:scale-[0.97] transition-transform"
          >
            <Play size={14} fill="currentColor" /> START
          </button>
        ) : (
          <Lock size={18} className="text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
