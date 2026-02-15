import { AppSettings, AppData, BASE_EXERCISES } from '@/data/exercises';
import { Download, Upload, Trash2 } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getLastSaved } from '@/lib/storage';
import { getDemoCacheStats, clearDemoCache } from '@/lib/demoCache';

interface SettingsPageProps {
  settings: AppSettings;
  hydrated: boolean;
  workoutsCount: number;
  onUpdateSettings: (s: Partial<AppSettings>) => void;
  onExport: () => string;
  onImport: (data: AppData) => void;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between bg-card rounded-xl p-4">
      <span className="font-medium text-foreground">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'w-12 h-7 rounded-full transition-colors relative',
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
  const [cacheStats, setCacheStats] = useState({ count: 0, sizeEstimate: '0 MB' });
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    getDemoCacheStats().then(setCacheStats);
  }, []);

  const handleClearCache = async () => {
    setClearing(true);
    await clearDemoCache();
    setCacheStats({ count: 0, sizeEstimate: '0 MB' });
    setClearing(false);
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
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        onImport(data);
      } catch {
        alert('Invalid backup file');
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

      {/* Demo Cache */}
      <div className="bg-card rounded-xl p-4 space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Demo Cache</p>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Cached demos</span>
          <span className="text-foreground font-mono text-primary">{cacheStats.count}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Storage used</span>
          <span className="text-foreground font-mono">{cacheStats.sizeEstimate}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Demos are fetched automatically from wger.de and cached for offline use.
        </p>
        {cacheStats.count > 0 && (
          <button
            onClick={handleClearCache}
            disabled={clearing}
            className="w-full flex items-center justify-center gap-2 bg-destructive/10 text-destructive font-medium py-2.5 rounded-lg text-sm active:bg-destructive/20 disabled:opacity-50"
          >
            <Trash2 size={14} />
            {clearing ? 'Clearing...' : 'Clear demo cache'}
          </button>
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
