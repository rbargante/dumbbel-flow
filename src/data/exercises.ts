export type WorkoutDay = 'push' | 'pull' | 'legs' | 'full_body';

export const DAY_NAMES: Record<WorkoutDay, string> = {
  push: 'Push Day',
  pull: 'Pull Day',
  legs: 'Legs Day',
  full_body: 'Full Body',
};

export const DAY_ORDER: WorkoutDay[] = ['push', 'pull', 'legs'];

// Program-specific day orders
export const PROGRAM_DAY_ORDERS: Record<string, WorkoutDay[]> = {
  ppl_dumbbell: ['push', 'pull', 'legs'],
  full_body_dumbbell: ['full_body'],
};

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  repRange: string;
  isCompound: boolean;
  day: WorkoutDay;
  mediaUrl?: string;
}

export interface SetLog {
  weight: number;
  reps: number;
  done: boolean;
  isWarmup?: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: SetLog[];
}

export interface WorkoutLog {
  id: string;
  date: string;
  day: WorkoutDay;
  exercises: ExerciseLog[];
  durationSeconds?: number;
  totalKg?: number;
  programId?: string;
}

export interface AppSettings {
  restTimerEnabled: boolean;
  soundEnabled: boolean;
  requirePelvicReset: boolean;
}

export type ProgramType = 'ppl' | 'full_body' | 'upper_lower';

export interface Program {
  id: string;
  name: string;
  type: ProgramType;
  isActive: boolean;
  equipment: string[];
  workoutDays: string[];
  rotationIndex: number;
  comingSoon?: boolean;
  category?: 'main' | 'complementary';
}

export const DEFAULT_PROGRAMS: Program[] = [
  // ─── Main Workouts ───
  {
    id: 'ppl_dumbbell',
    name: 'Dumbbell PPL',
    type: 'ppl',
    isActive: true,
    equipment: ['Dumbbells', 'Bench'],
    workoutDays: ['Push', 'Pull', 'Legs'],
    rotationIndex: 0,
    category: 'main',
  },
  {
    id: 'full_body_dumbbell',
    name: 'Dumbbell Full Body',
    type: 'full_body',
    isActive: false,
    equipment: ['Dumbbells', 'Bench'],
    workoutDays: ['Full Body'],
    rotationIndex: 0,
    category: 'main',
  },
  {
    id: 'ppl_ezbar',
    name: 'EZ Bar PPL',
    type: 'ppl',
    isActive: false,
    equipment: ['EZ Bar', 'Bench'],
    workoutDays: ['Push', 'Pull', 'Legs'],
    rotationIndex: 0,
    comingSoon: true,
    category: 'main',
  },
  {
    id: 'full_body_ezbar',
    name: 'EZ Bar Full Body',
    type: 'full_body',
    isActive: false,
    equipment: ['EZ Bar', 'Bench'],
    workoutDays: ['Full Body'],
    rotationIndex: 0,
    comingSoon: true,
    category: 'main',
  },
  {
    id: 'ppl_ironmaster',
    name: 'Ironmaster PPL',
    type: 'ppl',
    isActive: false,
    equipment: ['Ironmaster', 'Bench'],
    workoutDays: ['Push', 'Pull', 'Legs'],
    rotationIndex: 0,
    comingSoon: true,
    category: 'main',
  },
  {
    id: 'full_body_ironmaster',
    name: 'Ironmaster Full Body',
    type: 'full_body',
    isActive: false,
    equipment: ['Ironmaster', 'Bench'],
    workoutDays: ['Full Body'],
    rotationIndex: 0,
    comingSoon: true,
    category: 'main',
  },
  // ─── Complementary ───
  {
    id: 'pelvic_reset',
    name: 'Pelvic Tilt Reset',
    type: 'full_body',
    isActive: false,
    equipment: ['Bodyweight'],
    workoutDays: ['Pelvic Reset'],
    rotationIndex: 0,
    category: 'complementary',
  },
  {
    id: 'posture_routine',
    name: 'Posture Routine',
    type: 'full_body',
    isActive: false,
    equipment: ['Bodyweight'],
    workoutDays: ['Posture'],
    rotationIndex: 0,
    comingSoon: true,
    category: 'complementary',
  },
  {
    id: 'balance_longevity',
    name: 'Balance & Longevity',
    type: 'full_body',
    isActive: false,
    equipment: ['Bodyweight'],
    workoutDays: ['Balance'],
    rotationIndex: 0,
    comingSoon: true,
    category: 'complementary',
  },
];

export interface AppData {
  nextDayIndex: number;
  workouts: WorkoutLog[];
  lastSessionByExercise: Record<string, SetLog[]>;
  settings: AppSettings;
  programs: Program[];
}

export const PELVIC_RESET_EXERCISES = [
  { id: 'pr1', name: '90/90 Breathing', detail: '5 ciclos' },
  { id: 'pr2', name: 'Glute Bridge (posterior tilt)', detail: '2×12 com pausa 2s' },
  { id: 'pr3', name: 'Dead Bug', detail: '2×8 por lado' },
  { id: 'pr4', name: 'Split Squat leve', detail: '2×8 por lado' },
];

export const BASE_EXERCISES: Exercise[] = [
  // Push
  { id: 'push1', name: 'Flat Dumbbell Bench Press', sets: 4, repRange: '6–8', isCompound: true, day: 'push' },
  { id: 'push2', name: 'Incline Dumbbell Press', sets: 3, repRange: '8–10', isCompound: true, day: 'push' },
  { id: 'push3', name: 'Dumbbell Shoulder Press', sets: 3, repRange: '6–8', isCompound: true, day: 'push' },
  { id: 'push4', name: 'Lateral Raise', sets: 3, repRange: '12–15', isCompound: false, day: 'push' },
  { id: 'push5', name: 'Overhead Triceps Extension', sets: 3, repRange: '10–12', isCompound: false, day: 'push' },

  // Pull
  { id: 'pull1', name: 'One Arm Dumbbell Row', sets: 4, repRange: '6–8', isCompound: true, day: 'pull' },
  { id: 'pull2', name: 'Dumbbell Romanian Deadlift', sets: 4, repRange: '6–8', isCompound: true, day: 'pull' },
  { id: 'pull3', name: 'Dumbbell Pullover', sets: 3, repRange: '8–10', isCompound: true, day: 'pull' },
  { id: 'pull4', name: 'Rear Delt Fly', sets: 3, repRange: '12–15', isCompound: false, day: 'pull' },
  { id: 'pull5', name: 'Dumbbell Curl', sets: 3, repRange: '8–10', isCompound: false, day: 'pull' },
  { id: 'pull6', name: 'Hammer Curl', sets: 3, repRange: '10–12', isCompound: false, day: 'pull' },

  // Legs
  { id: 'legs1', name: 'Goblet Squat', sets: 4, repRange: '8–10', isCompound: true, day: 'legs' },
  { id: 'legs2', name: 'Bulgarian Split Squat', sets: 3, repRange: '8 cada perna', isCompound: true, day: 'legs' },
  { id: 'legs3', name: 'Dumbbell RDL', sets: 3, repRange: '8–10', isCompound: true, day: 'legs' },
  { id: 'legs4', name: 'Walking Lunges', sets: 3, repRange: '10 cada perna', isCompound: true, day: 'legs' },
  { id: 'legs5', name: 'Standing Calf Raise', sets: 4, repRange: '12–15', isCompound: false, day: 'legs' },

  // Full Body
  { id: 'fb1', name: 'Flat Dumbbell Bench Press', sets: 4, repRange: '6–8', isCompound: true, day: 'full_body' },
  { id: 'fb2', name: 'One-Arm Dumbbell Row', sets: 4, repRange: '6–8', isCompound: true, day: 'full_body' },
  { id: 'fb3', name: 'Goblet Squat', sets: 4, repRange: '8–10', isCompound: true, day: 'full_body' },
  { id: 'fb4', name: 'Romanian Deadlift', sets: 4, repRange: '6–8', isCompound: true, day: 'full_body' },
  { id: 'fb5', name: 'Seated Dumbbell Shoulder Press', sets: 4, repRange: '6–8', isCompound: true, day: 'full_body' },
  { id: 'fb6', name: 'Dumbbell Lateral Raise', sets: 4, repRange: '12–15', isCompound: false, day: 'full_body' },
  { id: 'fb7', name: 'Alternating Dumbbell Curl', sets: 4, repRange: '8–10', isCompound: false, day: 'full_body' },
  { id: 'fb8', name: 'Overhead Dumbbell Triceps Extension', sets: 4, repRange: '10–12', isCompound: false, day: 'full_body' },
  { id: 'fb9', name: 'Standing Calf Raise', sets: 4, repRange: '12–15', isCompound: false, day: 'full_body' },
];

export const EXTRA_EXERCISES: Record<WorkoutDay, { id: string; name: string; defaultSets: number; repRange: string; isCompound: boolean }[]> = {
  push: [
    { id: 'extra_push1', name: 'Chest Fly', defaultSets: 3, repRange: '10–12', isCompound: false },
    { id: 'extra_push2', name: 'Front Raise', defaultSets: 3, repRange: '12–15', isCompound: false },
    { id: 'extra_push3', name: 'Triceps Kickback', defaultSets: 3, repRange: '10–12', isCompound: false },
    { id: 'extra_push4', name: 'Close Grip Press', defaultSets: 3, repRange: '8–10', isCompound: true },
  ],
  pull: [
    { id: 'extra_pull1', name: 'Shrug', defaultSets: 3, repRange: '12–15', isCompound: false },
    { id: 'extra_pull2', name: 'Concentration Curl', defaultSets: 3, repRange: '10–12', isCompound: false },
    { id: 'extra_pull3', name: 'Reverse Fly', defaultSets: 3, repRange: '12–15', isCompound: false },
    { id: 'extra_pull4', name: 'Face Pull (band)', defaultSets: 3, repRange: '15–20', isCompound: false },
  ],
  legs: [
    { id: 'extra_legs1', name: 'Sumo Squat', defaultSets: 3, repRange: '10–12', isCompound: true },
    { id: 'extra_legs2', name: 'Step Up', defaultSets: 3, repRange: '10 cada perna', isCompound: true },
    { id: 'extra_legs3', name: 'Seated Calf Raise', defaultSets: 3, repRange: '15–20', isCompound: false },
    { id: 'extra_legs4', name: 'Hip Thrust', defaultSets: 3, repRange: '10–12', isCompound: true },
  ],
  full_body: [
    { id: 'extra_fb1', name: 'Chest Fly', defaultSets: 3, repRange: '10–12', isCompound: false },
    { id: 'extra_fb2', name: 'Rear Delt Fly', defaultSets: 3, repRange: '12–15', isCompound: false },
    { id: 'extra_fb3', name: 'Hammer Curl', defaultSets: 3, repRange: '10–12', isCompound: false },
    { id: 'extra_fb4', name: 'Walking Lunges', defaultSets: 3, repRange: '10 cada perna', isCompound: true },
  ],
};

// Exercise equivalents for swap feature
export const EXERCISE_EQUIVALENTS: Record<string, { id: string; name: string; sets: number; repRange: string; isCompound: boolean }[]> = {
  push1: [
    { id: 'push1_alt1', name: 'Floor Dumbbell Press', sets: 4, repRange: '6–8', isCompound: true },
  ],
  push2: [
    { id: 'push2_alt1', name: 'Decline Dumbbell Press', sets: 3, repRange: '8–10', isCompound: true },
  ],
  push3: [
    { id: 'push3_alt1', name: 'Arnold Press', sets: 3, repRange: '6–8', isCompound: true },
  ],
  push4: [
    { id: 'push4_alt1', name: 'Front Raise', sets: 3, repRange: '12–15', isCompound: false },
    { id: 'push4_alt2', name: 'Cable Lateral Raise', sets: 3, repRange: '12–15', isCompound: false },
  ],
  push5: [
    { id: 'push5_alt1', name: 'Triceps Kickback', sets: 3, repRange: '10–12', isCompound: false },
    { id: 'push5_alt2', name: 'Diamond Push-Up', sets: 3, repRange: '10–15', isCompound: false },
  ],
  pull1: [
    { id: 'pull1_alt1', name: 'Bent Over Dumbbell Row', sets: 4, repRange: '6–8', isCompound: true },
  ],
  pull2: [
    { id: 'pull2_alt1', name: 'Stiff Leg Deadlift', sets: 4, repRange: '6–8', isCompound: true },
  ],
  pull3: [
    { id: 'pull3_alt1', name: 'Chest Supported Row', sets: 3, repRange: '8–10', isCompound: true },
  ],
  pull4: [
    { id: 'pull4_alt1', name: 'Band Pull-Apart', sets: 3, repRange: '15–20', isCompound: false },
  ],
  pull5: [
    { id: 'pull5_alt1', name: 'Concentration Curl', sets: 3, repRange: '8–10', isCompound: false },
  ],
  pull6: [
    { id: 'pull6_alt1', name: 'Cross Body Curl', sets: 3, repRange: '10–12', isCompound: false },
  ],
  legs1: [
    { id: 'legs1_alt1', name: 'Sumo Squat', sets: 4, repRange: '8–10', isCompound: true },
  ],
  legs2: [
    { id: 'legs2_alt1', name: 'Reverse Lunge', sets: 3, repRange: '8 cada perna', isCompound: true },
  ],
  legs3: [
    { id: 'legs3_alt1', name: 'Single Leg RDL', sets: 3, repRange: '8–10', isCompound: true },
  ],
  legs4: [
    { id: 'legs4_alt1', name: 'Step Up', sets: 3, repRange: '10 cada perna', isCompound: true },
  ],
  legs5: [
    { id: 'legs5_alt1', name: 'Seated Calf Raise', sets: 4, repRange: '15–20', isCompound: false },
  ],
  // Full Body equivalents
  fb1: [
    { id: 'fb1_alt1', name: 'Floor Dumbbell Press', sets: 4, repRange: '6–8', isCompound: true },
  ],
  fb2: [
    { id: 'fb2_alt1', name: 'Bent Over Dumbbell Row', sets: 4, repRange: '6–8', isCompound: true },
  ],
  fb3: [
    { id: 'fb3_alt1', name: 'Sumo Squat', sets: 4, repRange: '8–10', isCompound: true },
  ],
  fb4: [
    { id: 'fb4_alt1', name: 'Stiff Leg Deadlift', sets: 4, repRange: '6–8', isCompound: true },
  ],
  fb5: [
    { id: 'fb5_alt1', name: 'Arnold Press', sets: 4, repRange: '6–8', isCompound: true },
  ],
  fb7: [
    { id: 'fb7_alt1', name: 'Hammer Curl', sets: 4, repRange: '8–10', isCompound: false },
  ],
  fb8: [
    { id: 'fb8_alt1', name: 'Triceps Kickback', sets: 4, repRange: '10–12', isCompound: false },
  ],
};

export const DEFAULT_APP_DATA: AppData = {
  nextDayIndex: 0,
  workouts: [],
  lastSessionByExercise: {},
  settings: {
    restTimerEnabled: true,
    soundEnabled: true,
    requirePelvicReset: true,
  },
  programs: DEFAULT_PROGRAMS,
};
