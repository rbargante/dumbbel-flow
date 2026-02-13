import { useState } from 'react';
import { useAppData } from '@/hooks/useAppData';
import { BottomNav } from '@/components/BottomNav';
import { HomePage } from '@/pages/HomePage';
import { PelvicResetPage } from '@/pages/PelvicResetPage';
import { WorkoutPage } from '@/pages/WorkoutPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { SettingsPage } from '@/pages/SettingsPage';

type Screen = 'home' | 'history' | 'settings' | 'pelvic-reset' | 'workout';

const Index = () => {
  const appData = useAppData();
  const [screen, setScreen] = useState<Screen>('home');
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'settings'>('home');

  const navigate = (s: Screen) => {
    setScreen(s);
    if (s === 'home' || s === 'history' || s === 'settings') setActiveTab(s);
  };

  const handleStartWorkout = () => {
    if (appData.data.settings.requirePelvicReset) {
      navigate('pelvic-reset');
    } else {
      navigate('workout');
    }
  };

  const handleSelectProgram = (programId: string) => {
    // For now, only active program can be started
    const program = appData.data.programs.find(p => p.id === programId);
    if (program?.isActive) {
      handleStartWorkout();
    }
  };

  const handleStartMain = () => navigate('workout');
  const handleFinishWorkout = () => navigate('home');

  return (
    <div className="min-h-screen bg-background pb-20">
      {screen === 'home' && (
        <HomePage
          data={appData.data}
          onStartWorkout={handleStartWorkout}
          onSelectProgram={handleSelectProgram}
        />
      )}
      {screen === 'pelvic-reset' && <PelvicResetPage onStart={handleStartMain} onBack={() => navigate('home')} />}
      {screen === 'workout' && (
        <WorkoutPage
          data={appData.data}
          onFinish={(workout) => { appData.saveWorkout(workout); handleFinishWorkout(); }}
        />
      )}
      {screen === 'history' && <HistoryPage workouts={appData.data.workouts} />}
      {screen === 'settings' && (
        <SettingsPage
          settings={appData.data.settings}
          hydrated={appData.hydrated}
          workoutsCount={appData.data.workouts.length}
          onUpdateSettings={appData.updateSettings}
          onExport={appData.exportData}
          onImport={appData.importData}
        />
      )}

      {(screen === 'home' || screen === 'history' || screen === 'settings') && (
        <BottomNav active={activeTab} onNavigate={navigate} />
      )}
    </div>
  );
};

export default Index;
