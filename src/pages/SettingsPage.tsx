import { AppSettings, AppData } from '@/data/exercises';
import { Download, Upload } from 'lucide-react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface SettingsPageProps {
  settings: AppSettings;
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

export function SettingsPage({ settings, onUpdateSettings, onExport, onImport }: SettingsPageProps) {
  const fileRef = useRef<HTMLInputElement>(null);

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

      <Toggle
        label="Rest Timer"
        checked={settings.restTimerEnabled}
        onChange={v => onUpdateSettings({ restTimerEnabled: v })}
      />

      <Toggle
        label="Sound"
        checked={settings.soundEnabled}
        onChange={v => onUpdateSettings({ soundEnabled: v })}
      />

      <button
        onClick={handleExport}
        className="w-full bg-card rounded-xl p-4 flex items-center gap-3 text-foreground font-medium"
      >
        <Download size={20} className="text-primary" />
        Export Backup (JSON)
      </button>

      <button
        onClick={() => fileRef.current?.click()}
        className="w-full bg-card rounded-xl p-4 flex items-center gap-3 text-foreground font-medium"
      >
        <Upload size={20} className="text-primary" />
        Import Backup (JSON)
      </button>
      <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
    </div>
  );
}
