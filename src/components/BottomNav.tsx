import { Home, History, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  active: 'home' | 'history' | 'settings';
  onNavigate: (tab: 'home' | 'history' | 'settings') => void;
}

const tabs = [
  { id: 'home' as const, label: 'Home', icon: Home },
  { id: 'history' as const, label: 'History', icon: History },
  { id: 'settings' as const, label: 'Settings', icon: Settings },
];

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={cn(
              'flex flex-col items-center gap-1 px-4 py-2 transition-colors',
              active === tab.id ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <tab.icon size={22} />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
