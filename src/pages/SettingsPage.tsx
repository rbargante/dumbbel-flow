import { AppSettings, AppData } from '@/data/exercises';
import { Download, Upload, Share2, Smartphone } from 'lucide-react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { getLastSaved } from '@/lib/storage';
import { z } from 'zod';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { toast } from '@/hooks/use-toast';

const SetLogSchema = z.object({
  weight: z.number(),
  reps: z.number(),
  done: z.boolean(),
  isWarmup: z.boolean().optional(),
});

const AppDataSchema = z.object({
  nextDayIndex: z.number().int().min(0),
  workouts: z.array(z.object({
    id: z.string(),
    date: z.string(),
    day: z.string(),
    exercises: z.array(z.object({
      exerciseId: z.string(),
      exerciseName: z.string(),
      sets: z.array(SetLogSchema),
    })),
    durationSeconds: z.number().optional(),
    totalKg: z.number().optional(),
    programId: z.string().optional(),
  })),
  lastSessionByExercise: z.record(z.string(), z.array(SetLogSchema)),
  settings: z.object({
    restTimerEnabled: z.boolean(),
    soundEnabled: z.boolean(),
    requirePelvicReset: z.boolean(),
  }),
  programs: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    isActive: z.boolean(),
    equipment: z.array(z.string()),
    workoutDays: z.array(z.string()),
    rotationIndex: z.number(),
    comingSoon: z.boolean().optional(),
    category: z.string().optional(),
  })),
});

interface SettingsPageProps {
  settings: AppSettings;
  hydrated: boolean;
  workoutsCount: number;
  onUpdateSettings: (s: Partial<AppSettings>) => void;
  onExport: () => string;
  onImport: (data: AppData) => void;
}

function Toggle({ label, checked, onChange, description }: { label: string; checked: boolean; onChange: (v: boolean) => void; description?: string }) {
  return (
    <div className="flex items-center justify-between bg-card rounded-xl p-4">
      <div className="flex-1">
        <span className="font-medium text-foreground">{label}</span>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'w-12 h-7 rounded-full transition-colors relative shrink-0 ml-3',
          checked ? 'bg-primary' : 'bg-secondary'
        )}
      >
        <div className={cn(
          'w-5 h-5 rounded-full bg-white absolute top-1 transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1'
        )} />
      </button>
    </div>
  );
}

export function SettingsPage({ settings, hydrated, workoutsCount, onUpdateSettings, onExport, onImport }: SettingsPageProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { installPrompt, isInstalled, isIOS, isAndroid, promptInstall } = useInstallPrompt();

  const handleShare = async () => {
    const shareData = {
      title: 'Ricardo Routine',
      text: 'My offline gym routine app',
      url: window.location.origin,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.origin);
      toast({ title: 'Link copied' });
    }
  };

  const getInstallHint = () => {
    if (isInstalled) return null;
    if (installPrompt) return null;
    if (isIOS) return 'Open in Safari → Share → Add to Home Screen';
    if (isAndroid) return 'Menu (⋮) → Install app / Add to Home Screen';
    return 'Use Chrome or Safari on mobile to install';
  };

  const handleExport = () => {
    const json = onExport();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ricardo-routine-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Maximum size is 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        const validated = AppDataSchema.parse(parsed);
        onImport(validated as AppData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          alert('Invalid backup format: ' + error.errors.map(e => e.message).join(', '));
        } else {
          alert('Invalid backup file');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="px-4 pt-12 pb-24 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-black text-foreground">Settings</h1>

      <Toggle label="Rest Timer" checked={settings.restTimerEnabled} onChange={v => onUpdateSettings({ restTimerEnabled: v })} />
      <Toggle label="Sound" checked={settings.soundEnabled} onChange={v => onUpdateSettings({ soundEnabled: v })} />
      <Toggle label="Require Pelvic Reset" checked={settings.requirePelvicReset} onChange={v => onUpdateSettings({ requirePelvicReset: v })} />

      <button onClick={handleExport} className="w-full bg-card rounded-xl p-4 flex items-center gap-3 text-foreground font-medium">
        <Download size={20} className="text-primary" />
        Export Backup (JSON)
      </button>

      <button onClick={() => fileRef.current?.click()} className="w-full bg-card rounded-xl p-4 flex items-center gap-3 text-foreground font-medium">
        <Upload size={20} className="text-primary" />
        Import Backup (JSON)
      </button>
      <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

      {/* Install / Share */}
      <div className="bg-card rounded-xl p-4 space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Install / Share</p>
        <div className="flex gap-3">
          {isInstalled ? (
            <button disabled className="flex-1 flex items-center justify-center gap-2 bg-secondary text-muted-foreground font-medium py-3 rounded-xl opacity-60">
              <Smartphone size={18} /> Already installed
            </button>
          ) : (
            <button
              onClick={installPrompt ? promptInstall : undefined}
              disabled={!installPrompt}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 font-medium py-3 rounded-xl transition-transform',
                installPrompt
                  ? 'bg-primary text-primary-foreground active:scale-[0.98]'
                  : 'bg-secondary text-muted-foreground opacity-60'
              )}
            >
              <Smartphone size={18} /> Install App
            </button>
          )}
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 bg-card text-foreground font-medium py-3 rounded-xl border border-secondary active:scale-[0.98] transition-transform"
          >
            <Share2 size={18} /> Share App
          </button>
        </div>
        {getInstallHint() && (
          <p className="text-xs text-muted-foreground text-center">{getInstallHint()}</p>
        )}
        {!navigator.share && (
          <p className="text-xs text-muted-foreground text-center">Share copies the link to clipboard</p>
        )}
      </div>

      {/* Debug Section */}
      <div className="bg-card rounded-xl p-4 space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Debug</p>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Hydrated</span>
          <span className="text-foreground font-mono">{String(hydrated)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Workouts</span>
          <span className="text-foreground font-mono">{workoutsCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Last saved</span>
          <span className="text-foreground font-mono text-xs">{getLastSaved() || 'never'}</span>
        </div>
      </div>
    </div>
  );
}
