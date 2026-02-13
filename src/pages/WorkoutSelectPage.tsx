import { DAY_NAMES, DAY_ORDER, WorkoutDay } from '@/data/exercises';
import { ArrowLeft, ChevronRight, Zap } from 'lucide-react';

interface WorkoutSelectPageProps {
  programName: string;
  nextDayIndex: number;
  onSelectDay: (dayIndex: number) => void;
  onStartNext: () => void;
  onBack: () => void;
}

export function WorkoutSelectPage({
  programName,
  nextDayIndex,
  onSelectDay,
  onStartNext,
  onBack,
}: WorkoutSelectPageProps) {
  const nextDay = DAY_ORDER[nextDayIndex];

  return (
    <div className="px-4 pt-6 pb-24 max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg active:bg-secondary transition-colors"
        >
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-black text-foreground">{programName}</h1>
          <p className="text-xs text-muted-foreground">Choose your workout</p>
        </div>
      </div>

      {/* Start Next Workout — hero button */}
      <button
        onClick={onStartNext}
        className="w-full bg-primary text-primary-foreground rounded-xl p-5 flex items-center justify-between active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-3">
          <Zap size={22} fill="currentColor" />
          <div className="text-left">
            <p className="font-black text-base">Start Next Workout</p>
            <p className="text-xs opacity-80">{DAY_NAMES[nextDay]}</p>
          </div>
        </div>
        <ChevronRight size={20} />
      </button>

      {/* Individual day cards */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          All Workouts
        </p>
        {DAY_ORDER.map((day, index) => {
          const isNext = index === nextDayIndex;
          return (
            <button
              key={day}
              onClick={() => onSelectDay(index)}
              className="w-full bg-card rounded-xl p-4 flex items-center justify-between active:scale-[0.99] transition-transform"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black ${
                    isNext
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {day[0].toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground text-sm">{DAY_NAMES[day]}</p>
                  {isNext && (
                    <p className="text-[10px] text-primary font-semibold">UP NEXT</p>
                  )}
                </div>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
