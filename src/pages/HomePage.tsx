import { AppData, DAY_NAMES, DAY_ORDER } from '@/data/exercises';
import { Dumbbell, ChevronRight } from 'lucide-react';

interface HomePageProps {
  data: AppData;
  onStartWorkout: () => void;
}

export function HomePage({ data, onStartWorkout }: HomePageProps) {
  const nextDay = DAY_ORDER[data.nextDayIndex];
  const upcomingDay = DAY_ORDER[(data.nextDayIndex + 1) % 3];

  return (
    <div className="px-4 pt-12 pb-24 max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <Dumbbell className="mx-auto text-primary" size={40} />
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Ricardo Routine
        </h1>
        <p className="text-muted-foreground text-sm">Push • Pull • Legs</p>
      </div>

      {/* Next workout */}
      <div className="bg-card rounded-xl p-5 space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Next Workout</p>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">{DAY_NAMES[nextDay]}</h2>
          <ChevronRight className="text-primary" size={24} />
        </div>
      </div>

      {/* Upcoming */}
      <div className="bg-card rounded-xl p-5 space-y-2 opacity-60">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Up Next</p>
        <h2 className="text-lg font-bold text-foreground">{DAY_NAMES[upcomingDay]}</h2>
      </div>

      {/* Workout count */}
      <div className="bg-card rounded-xl p-5 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Total workouts</p>
        <span className="text-2xl font-black text-primary">{data.workouts.length}</span>
      </div>

      {/* Start button */}
      <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto">
        <button
          onClick={onStartWorkout}
          className="w-full bg-primary text-primary-foreground font-bold text-lg py-4 rounded-xl active:scale-[0.98] transition-transform"
        >
          START NEXT WORKOUT
        </button>
      </div>
    </div>
  );
}
