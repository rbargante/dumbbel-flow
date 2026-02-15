import { useState } from 'react';
import { useAppData } from '@/hooks/useAppData';
import { BottomNav } from '@/components/BottomNav';
import { HomePage } from '@/pages/HomePage';
import { WorkoutSelectPage } from '@/pages/WorkoutSelectPage';
import { PelvicResetPage } from '@/pages/PelvicResetPage';
import { WorkoutPage } from '@/pages/WorkoutPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { PROGRAM_DAY_ORDERS, DAY_ORDER } from '@/data/exercises';

type Screen = 'home' | 'workout-select' | 'history' | 'settings' | 'pelvic-reset' | 'workout';

const Index = () => {
  const appData = useAppData();
  const [screen, setScreen] = useState<Screen>('home');
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'settings'>('home');
  const [overrideDayIndex, setOverrideDayIndex] = useState<number | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);

  const activeProgram = appData.data.programs.find(p => p.isActive);
  const activeProgramId = activeProgram?.id || 'ppl_dumbbell';

  // Use selected program for workout flow, fallback to active
  const workoutProgramId = selectedProgramId || activeProgramId;
  const workoutProgram = appData.data.programs.find(p => p.id === workoutProgramId);

  const navigate = (s: Screen) => {
    setScreen(s);
    if (s === 'home' || s === 'history' || s === 'settings') setActiveTab(s);
  };

  const startWorkoutFlow = (dayIndex?: number) => {
    if (dayIndex !== undefined) setOverrideDayIndex(dayIndex);
    else setOverrideDayIndex(null);

    if (appData.data.settings.requirePelvicReset) {
      navigate('pelvic-reset');
    } else {
      navigate('workout');
    }
  };

  const handleSelectProgram = (programId: string) => {
    const program = appData.data.programs.find(p => p.id === programId);
    if (program && !program.comingSoon) {
      setSelectedProgramId(programId);
      navigate('workout-select');
    }
  };

  const handleFinishWorkout = () => {
    setOverrideDayIndex(null);
    setSelectedProgramId(null);
    navigate('home');
  };

  const effectiveDayIndex = overrideDayIndex ?? appData.data.nextDayIndex;

  return (
    <div className="min-h-screen bg-background pb-20">
      {screen === 'home' && (
        <HomePage
          data={appData.data}
          onStartWorkout={() => navigate('workout-select')}
          onSelectProgram={handleSelectProgram}
        />
      )}
      {screen === 'workout-select' && (
        <WorkoutSelectPage
          programId={workoutProgramId}
          programName={workoutProgram?.name ?? 'Workout'}
          nextDayIndex={appData.data.nextDayIndex}
          onSelectDay={(dayIndex) => startWorkoutFlow(dayIndex)}
          onStartNext={() => startWorkoutFlow()}
          onBack={() => { setSelectedProgramId(null); navigate('home'); }}
        />
      )}
      {screen === 'pelvic-reset' && (
        <PelvicResetPage
          onStart={() => navigate('workout')}
          onBack={() => navigate('workout-select')}
        />
      )}
      {screen === 'workout' && (
        <WorkoutPage
          data={{ ...appData.data, nextDayIndex: effectiveDayIndex }}
          programId={workoutProgramId}
          onFinish={(workout) => { appData.saveWorkout(workout); handleFinishWorkout(); }}
          onHome={handleFinishWorkout}
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
