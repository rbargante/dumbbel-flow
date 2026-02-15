export type WorkoutDay = 'push' | 'pull' | 'legs' | 'full_body' | 'pelvic_reset' | 'posture' | 'balance' | 'mobility_core' | 'strength_maint' | 'cardio_capacity' | 'balance_stability';

export const DAY_NAMES: Record<WorkoutDay, string> = {
  push: 'Push Day',
  pull: 'Pull Day',
  legs: 'Legs Day',
  full_body: 'Full Body',
  pelvic_reset: 'Pelvic Reset',
  posture: 'Posture',
  balance: 'Balance & Longevity',
  mobility_core: 'Daily Mobility & Core',
  strength_maint: 'Strength Maintenance',
  cardio_capacity: 'Cardio & Capacity',
  balance_stability: 'Balance & Stability',
};

export const DAY_ORDER: WorkoutDay[] = ['push', 'pull', 'legs'];

export const PROGRAM_DAY_ORDERS: Record<string, WorkoutDay[]> = {
  ppl_dumbbell: ['push', 'pull', 'legs'],
  full_body_dumbbell: ['full_body'],
  ppl_ezbar: ['push', 'pull', 'legs'],
  full_body_ezbar: ['full_body'],
  ppl_ironmaster: ['push', 'pull', 'legs'],
  full_body_ironmaster: ['full_body'],
  pelvic_reset: ['pelvic_reset'],
  posture_routine: ['posture'],
  balance_longevity: ['balance'],
  longevity_protocol: ['mobility_core', 'strength_maint', 'cardio_capacity', 'balance_stability'],
};

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  repRange: string;
  isCompound: boolean;
  day: WorkoutDay;
  programId: string;
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
  category?: 'main' | 'complementary' | 'longevity';
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
    equipment: ['EZ Bar', 'Dumbbells'],
    workoutDays: ['Push', 'Pull', 'Legs'],
    rotationIndex: 0,
    category: 'main',
  },
  {
    id: 'full_body_ezbar',
    name: 'EZ Bar Full Body',
    type: 'full_body',
    isActive: false,
    equipment: ['EZ Bar', 'Dumbbells'],
    workoutDays: ['Full Body'],
    rotationIndex: 0,
    category: 'main',
  },
  {
    id: 'ppl_ironmaster',
    name: 'Ironmaster PPL',
    type: 'ppl',
    isActive: false,
    equipment: ['Full Home Gym'],
    workoutDays: ['Push', 'Pull', 'Legs'],
    rotationIndex: 0,
    category: 'main',
  },
  {
    id: 'full_body_ironmaster',
    name: 'Ironmaster Full Body',
    type: 'full_body',
    isActive: false,
    equipment: ['Full Home Gym'],
    workoutDays: ['Full Body'],
    rotationIndex: 0,
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
    category: 'complementary',
  },
  {
    id: 'balance_longevity',
    name: 'Balance & Longevity',
    type: 'full_body',
    isActive: false,
    equipment: ['Dumbbells'],
    workoutDays: ['Balance'],
    rotationIndex: 0,
    category: 'complementary',
  },
  // ─── Longevity ───
  {
    id: 'longevity_protocol',
    name: 'Longevity Protocol',
    type: 'full_body',
    isActive: false,
    equipment: ['Bodyweight', 'Dumbbells', 'Cable', 'Bench'],
    workoutDays: ['Mobility & Core', 'Strength', 'Cardio', 'Balance'],
    rotationIndex: 0,
    category: 'longevity',
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
  { id: 'pr1', name: 'Posterior Pelvic Tilt Hold', detail: '3×30s hold' },
  { id: 'pr2', name: 'Dead Bug', detail: '3×8 each side' },
  { id: 'pr3', name: 'Glute Bridge Hold', detail: '3×30s hold' },
];

// ═══════════════════════════════════════════
//  BASE EXERCISES — All Programs
// ═══════════════════════════════════════════

export const BASE_EXERCISES: Exercise[] = [
  // ─── DUMBBELL PPL ───
  // Push
  { id: 'push1', name: 'Flat Dumbbell Bench Press', sets: 4, repRange: '6–8', isCompound: true, day: 'push', programId: 'ppl_dumbbell' },
  { id: 'push2', name: 'Incline Dumbbell Bench Press', sets: 4, repRange: '8–10', isCompound: true, day: 'push', programId: 'ppl_dumbbell' },
  { id: 'push3', name: 'Seated Dumbbell Shoulder Press', sets: 4, repRange: '8–10', isCompound: true, day: 'push', programId: 'ppl_dumbbell' },
  { id: 'push4', name: 'Dumbbell Lateral Raise', sets: 4, repRange: '12–15', isCompound: false, day: 'push', programId: 'ppl_dumbbell' },
  { id: 'push5', name: 'Dumbbell Overhead Triceps Extension', sets: 4, repRange: '10–12', isCompound: false, day: 'push', programId: 'ppl_dumbbell' },
  // Pull
  { id: 'pull1', name: 'One-Arm Dumbbell Row', sets: 4, repRange: '6–8', isCompound: true, day: 'pull', programId: 'ppl_dumbbell' },
  { id: 'pull2', name: 'Chest-Supported Dumbbell Row', sets: 4, repRange: '8–10', isCompound: true, day: 'pull', programId: 'ppl_dumbbell' },
  { id: 'pull3', name: 'Dumbbell Rear Delt Raise', sets: 4, repRange: '12–15', isCompound: false, day: 'pull', programId: 'ppl_dumbbell' },
  { id: 'pull4', name: 'Dumbbell Hammer Curl', sets: 4, repRange: '10–12', isCompound: false, day: 'pull', programId: 'ppl_dumbbell' },
  { id: 'pull5', name: 'Dumbbell Curl', sets: 4, repRange: '10–12', isCompound: false, day: 'pull', programId: 'ppl_dumbbell' },
  // Legs
  { id: 'legs1', name: 'Goblet Squat', sets: 4, repRange: '8–10', isCompound: true, day: 'legs', programId: 'ppl_dumbbell' },
  { id: 'legs2', name: 'Bulgarian Split Squat', sets: 4, repRange: '8 each', isCompound: true, day: 'legs', programId: 'ppl_dumbbell' },
  { id: 'legs3', name: 'Dumbbell Romanian Deadlift', sets: 4, repRange: '8–10', isCompound: true, day: 'legs', programId: 'ppl_dumbbell' },
  { id: 'legs4', name: 'Dumbbell Hip Thrust', sets: 4, repRange: '10–12', isCompound: true, day: 'legs', programId: 'ppl_dumbbell' },
  { id: 'legs5', name: 'Standing Dumbbell Calf Raise', sets: 4, repRange: '12–15', isCompound: false, day: 'legs', programId: 'ppl_dumbbell' },

  // ─── DUMBBELL FULL BODY ───
  { id: 'fb1', name: 'Flat Dumbbell Bench Press', sets: 4, repRange: '6–8', isCompound: true, day: 'full_body', programId: 'full_body_dumbbell' },
  { id: 'fb2', name: 'One-Arm Dumbbell Row', sets: 4, repRange: '6–8', isCompound: true, day: 'full_body', programId: 'full_body_dumbbell' },
  { id: 'fb3', name: 'Goblet Squat', sets: 4, repRange: '8–10', isCompound: true, day: 'full_body', programId: 'full_body_dumbbell' },
  { id: 'fb4', name: 'Dumbbell Romanian Deadlift', sets: 4, repRange: '8–10', isCompound: true, day: 'full_body', programId: 'full_body_dumbbell' },
  { id: 'fb5', name: 'Seated Dumbbell Shoulder Press', sets: 4, repRange: '8–10', isCompound: true, day: 'full_body', programId: 'full_body_dumbbell' },
  { id: 'fb6', name: 'Dumbbell Lateral Raise', sets: 4, repRange: '12–15', isCompound: false, day: 'full_body', programId: 'full_body_dumbbell' },
  { id: 'fb7', name: 'Dumbbell Curl', sets: 4, repRange: '10–12', isCompound: false, day: 'full_body', programId: 'full_body_dumbbell' },
  { id: 'fb8', name: 'Dumbbell Overhead Triceps Extension', sets: 4, repRange: '10–12', isCompound: false, day: 'full_body', programId: 'full_body_dumbbell' },
  { id: 'fb9', name: 'Standing Dumbbell Calf Raise', sets: 4, repRange: '12–15', isCompound: false, day: 'full_body', programId: 'full_body_dumbbell' },

  // ─── EZ BAR PPL ───
  // Push
  { id: 'ez_push1', name: 'EZ Bar Floor Press', sets: 4, repRange: '6–8', isCompound: true, day: 'push', programId: 'ppl_ezbar' },
  { id: 'ez_push2', name: 'Close-Grip EZ Bar Press', sets: 4, repRange: '8–10', isCompound: true, day: 'push', programId: 'ppl_ezbar' },
  { id: 'ez_push3', name: 'EZ Bar Skullcrusher', sets: 4, repRange: '10–12', isCompound: false, day: 'push', programId: 'ppl_ezbar' },
  { id: 'ez_push4', name: 'Dumbbell Lateral Raise', sets: 4, repRange: '12–15', isCompound: false, day: 'push', programId: 'ppl_ezbar' },
  // Pull
  { id: 'ez_pull1', name: 'EZ Bar Bent-Over Row', sets: 4, repRange: '6–8', isCompound: true, day: 'pull', programId: 'ppl_ezbar' },
  { id: 'ez_pull2', name: 'EZ Bar Curl', sets: 4, repRange: '10–12', isCompound: false, day: 'pull', programId: 'ppl_ezbar' },
  { id: 'ez_pull3', name: 'Reverse EZ Bar Curl', sets: 4, repRange: '10–12', isCompound: false, day: 'pull', programId: 'ppl_ezbar' },
  { id: 'ez_pull4', name: 'Dumbbell Rear Delt Raise', sets: 4, repRange: '12–15', isCompound: false, day: 'pull', programId: 'ppl_ezbar' },
  // Legs
  { id: 'ez_legs1', name: 'EZ Bar Romanian Deadlift', sets: 4, repRange: '8–10', isCompound: true, day: 'legs', programId: 'ppl_ezbar' },
  { id: 'ez_legs2', name: 'Goblet Squat', sets: 4, repRange: '8–10', isCompound: true, day: 'legs', programId: 'ppl_ezbar' },
  { id: 'ez_legs3', name: 'Bulgarian Split Squat', sets: 4, repRange: '8 each', isCompound: true, day: 'legs', programId: 'ppl_ezbar' },
  { id: 'ez_legs4', name: 'Standing Calf Raise', sets: 4, repRange: '12–15', isCompound: false, day: 'legs', programId: 'ppl_ezbar' },

  // ─── EZ BAR FULL BODY ───
  { id: 'ez_fb1', name: 'EZ Bar Floor Press', sets: 4, repRange: '6–8', isCompound: true, day: 'full_body', programId: 'full_body_ezbar' },
  { id: 'ez_fb2', name: 'EZ Bar Bent-Over Row', sets: 4, repRange: '6–8', isCompound: true, day: 'full_body', programId: 'full_body_ezbar' },
  { id: 'ez_fb3', name: 'EZ Bar Romanian Deadlift', sets: 4, repRange: '8–10', isCompound: true, day: 'full_body', programId: 'full_body_ezbar' },
  { id: 'ez_fb4', name: 'Goblet Squat', sets: 4, repRange: '8–10', isCompound: true, day: 'full_body', programId: 'full_body_ezbar' },
  { id: 'ez_fb5', name: 'EZ Bar Curl', sets: 4, repRange: '10–12', isCompound: false, day: 'full_body', programId: 'full_body_ezbar' },
  { id: 'ez_fb6', name: 'EZ Bar Skullcrusher', sets: 4, repRange: '10–12', isCompound: false, day: 'full_body', programId: 'full_body_ezbar' },
  { id: 'ez_fb7', name: 'Standing Calf Raise', sets: 4, repRange: '12–15', isCompound: false, day: 'full_body', programId: 'full_body_ezbar' },

  // ─── IRONMASTER PPL ───
  // Push
  { id: 'im_push1', name: 'Flat Dumbbell Bench Press', sets: 4, repRange: '6–8', isCompound: true, day: 'push', programId: 'ppl_ironmaster' },
  { id: 'im_push2', name: 'Incline Dumbbell Bench Press', sets: 4, repRange: '8–10', isCompound: true, day: 'push', programId: 'ppl_ironmaster' },
  { id: 'im_push3', name: 'Seated Dumbbell Shoulder Press', sets: 4, repRange: '8–10', isCompound: true, day: 'push', programId: 'ppl_ironmaster' },
  { id: 'im_push4', name: 'Cable Triceps Pushdown', sets: 4, repRange: '10–12', isCompound: false, day: 'push', programId: 'ppl_ironmaster' },
  { id: 'im_push5', name: 'Dumbbell Lateral Raise', sets: 4, repRange: '12–15', isCompound: false, day: 'push', programId: 'ppl_ironmaster' },
  // Pull
  { id: 'im_pull1', name: 'Chin-Ups / Pull-Ups', sets: 4, repRange: 'Max', isCompound: true, day: 'pull', programId: 'ppl_ironmaster' },
  { id: 'im_pull2', name: 'One-Arm Cable Row', sets: 4, repRange: '10–12', isCompound: true, day: 'pull', programId: 'ppl_ironmaster' },
  { id: 'im_pull3', name: 'Chest-Supported Dumbbell Row', sets: 4, repRange: '8–10', isCompound: true, day: 'pull', programId: 'ppl_ironmaster' },
  { id: 'im_pull4', name: 'Cable Face Pull', sets: 4, repRange: '12–15', isCompound: false, day: 'pull', programId: 'ppl_ironmaster' },
  { id: 'im_pull5', name: 'Dumbbell / EZ Bar Curl', sets: 4, repRange: '10–12', isCompound: false, day: 'pull', programId: 'ppl_ironmaster' },
  // Legs
  { id: 'im_legs1', name: 'Goblet Squat', sets: 4, repRange: '8–10', isCompound: true, day: 'legs', programId: 'ppl_ironmaster' },
  { id: 'im_legs2', name: 'Bulgarian Split Squat', sets: 4, repRange: '8 each', isCompound: true, day: 'legs', programId: 'ppl_ironmaster' },
  { id: 'im_legs3', name: 'Leg Extension', sets: 4, repRange: '10–12', isCompound: false, day: 'legs', programId: 'ppl_ironmaster' },
  { id: 'im_legs4', name: 'Leg Curl', sets: 4, repRange: '10–12', isCompound: false, day: 'legs', programId: 'ppl_ironmaster' },
  { id: 'im_legs5', name: 'Dumbbell Romanian Deadlift', sets: 4, repRange: '8–10', isCompound: true, day: 'legs', programId: 'ppl_ironmaster' },
  { id: 'im_legs6', name: 'Standing Calf Raise', sets: 4, repRange: '12–15', isCompound: false, day: 'legs', programId: 'ppl_ironmaster' },

  // ─── IRONMASTER FULL BODY ───
  { id: 'im_fb1', name: 'Flat Dumbbell Bench Press', sets: 4, repRange: '6–8', isCompound: true, day: 'full_body', programId: 'full_body_ironmaster' },
  { id: 'im_fb2', name: 'Chin-Ups / Pull-Ups', sets: 4, repRange: 'Max', isCompound: true, day: 'full_body', programId: 'full_body_ironmaster' },
  { id: 'im_fb3', name: 'Cable Row', sets: 4, repRange: '10–12', isCompound: true, day: 'full_body', programId: 'full_body_ironmaster' },
  { id: 'im_fb4', name: 'Goblet Squat', sets: 4, repRange: '8–10', isCompound: true, day: 'full_body', programId: 'full_body_ironmaster' },
  { id: 'im_fb5', name: 'Leg Extension', sets: 4, repRange: '10–12', isCompound: false, day: 'full_body', programId: 'full_body_ironmaster' },
  { id: 'im_fb6', name: 'Dumbbell Romanian Deadlift', sets: 4, repRange: '8–10', isCompound: true, day: 'full_body', programId: 'full_body_ironmaster' },
  { id: 'im_fb7', name: 'Dumbbell Lateral Raise', sets: 4, repRange: '12–15', isCompound: false, day: 'full_body', programId: 'full_body_ironmaster' },
  { id: 'im_fb8', name: 'Dumbbell / EZ Bar Curl', sets: 4, repRange: '10–12', isCompound: false, day: 'full_body', programId: 'full_body_ironmaster' },
  { id: 'im_fb9', name: 'Cable Triceps Pushdown', sets: 4, repRange: '10–12', isCompound: false, day: 'full_body', programId: 'full_body_ironmaster' },
  { id: 'im_fb10', name: 'Standing Calf Raise', sets: 4, repRange: '12–15', isCompound: false, day: 'full_body', programId: 'full_body_ironmaster' },

  // ─── COMPLEMENTARY: PELVIC RESET ───
  { id: 'c_pr1', name: 'Posterior Pelvic Tilt Hold', sets: 3, repRange: '30s hold', isCompound: false, day: 'pelvic_reset', programId: 'pelvic_reset' },
  { id: 'c_pr2', name: 'Dead Bug', sets: 3, repRange: '8 each side', isCompound: false, day: 'pelvic_reset', programId: 'pelvic_reset' },
  { id: 'c_pr3', name: 'Glute Bridge Hold', sets: 3, repRange: '30s hold', isCompound: false, day: 'pelvic_reset', programId: 'pelvic_reset' },

  // ─── COMPLEMENTARY: POSTURE ───
  { id: 'c_pos1', name: 'Wall Slides', sets: 3, repRange: '10–12', isCompound: false, day: 'posture', programId: 'posture_routine' },
  { id: 'c_pos2', name: 'Rear Delt Raise', sets: 3, repRange: '12–15', isCompound: false, day: 'posture', programId: 'posture_routine' },
  { id: 'c_pos3', name: 'Chin Tucks', sets: 3, repRange: '15–20', isCompound: false, day: 'posture', programId: 'posture_routine' },

  // ─── COMPLEMENTARY: BALANCE & LONGEVITY ───
  { id: 'c_bal1', name: 'Single-Leg Stand', sets: 3, repRange: '30s each', isCompound: false, day: 'balance', programId: 'balance_longevity' },
  { id: 'c_bal2', name: 'Step-Back Lunge', sets: 3, repRange: '10 each', isCompound: true, day: 'balance', programId: 'balance_longevity' },
  { id: 'c_bal3', name: 'Slow Calf Raises', sets: 3, repRange: '15–20', isCompound: false, day: 'balance', programId: 'balance_longevity' },
  { id: 'c_bal4', name: 'Farmer Carry', sets: 3, repRange: '30s', isCompound: true, day: 'balance', programId: 'balance_longevity' },

  // ─── LONGEVITY PROTOCOL ───
  // Module 1: Daily Mobility & Core
  { id: 'lp_mc1', name: 'Pelvic Tilt (Posterior)', sets: 2, repRange: '10–12', isCompound: false, day: 'mobility_core', programId: 'longevity_protocol' },
  { id: 'lp_mc2', name: 'Dead Bug', sets: 2, repRange: '8 each side', isCompound: false, day: 'mobility_core', programId: 'longevity_protocol' },
  { id: 'lp_mc3', name: 'Bird Dog', sets: 2, repRange: '8 each side', isCompound: false, day: 'mobility_core', programId: 'longevity_protocol' },
  { id: 'lp_mc4', name: 'Cat–Cow Spinal Mobility', sets: 2, repRange: '10 cycles', isCompound: false, day: 'mobility_core', programId: 'longevity_protocol' },
  { id: 'lp_mc5', name: 'Hip Flexor Stretch', sets: 2, repRange: '30s each', isCompound: false, day: 'mobility_core', programId: 'longevity_protocol' },
  { id: 'lp_mc6', name: 'Thoracic Extension on Bench', sets: 2, repRange: '10–12', isCompound: false, day: 'mobility_core', programId: 'longevity_protocol' },
  { id: 'lp_mc7', name: 'Glute Bridge Hold', sets: 2, repRange: '30s hold', isCompound: false, day: 'mobility_core', programId: 'longevity_protocol' },

  // Module 2: Strength Maintenance
  { id: 'lp_sm1', name: 'Goblet Squat', sets: 3, repRange: '8–10', isCompound: true, day: 'strength_maint', programId: 'longevity_protocol' },
  { id: 'lp_sm2', name: 'Dumbbell Romanian Deadlift', sets: 3, repRange: '8–10', isCompound: true, day: 'strength_maint', programId: 'longevity_protocol' },
  { id: 'lp_sm3', name: 'Incline Dumbbell Press', sets: 3, repRange: '8–10', isCompound: true, day: 'strength_maint', programId: 'longevity_protocol' },
  { id: 'lp_sm4', name: 'One-Arm Dumbbell Row', sets: 3, repRange: '8–10', isCompound: true, day: 'strength_maint', programId: 'longevity_protocol' },
  { id: 'lp_sm5', name: 'Cable Face Pull', sets: 3, repRange: '12–15', isCompound: false, day: 'strength_maint', programId: 'longevity_protocol' },
  { id: 'lp_sm6', name: 'Standing Dumbbell Overhead Press', sets: 3, repRange: '8–10', isCompound: true, day: 'strength_maint', programId: 'longevity_protocol' },

  // Module 3: Cardio & Capacity
  { id: 'lp_cc1', name: 'Brisk Walking / March in Place', sets: 2, repRange: '5 min', isCompound: false, day: 'cardio_capacity', programId: 'longevity_protocol' },
  { id: 'lp_cc2', name: 'Step-Ups on Bench', sets: 3, repRange: '10 each', isCompound: true, day: 'cardio_capacity', programId: 'longevity_protocol' },
  { id: 'lp_cc3', name: 'Farmer Carry', sets: 3, repRange: '30–45s', isCompound: true, day: 'cardio_capacity', programId: 'longevity_protocol' },
  { id: 'lp_cc4', name: 'Light Intervals (optional)', sets: 2, repRange: '30s on / 30s off', isCompound: false, day: 'cardio_capacity', programId: 'longevity_protocol' },

  // Module 4: Balance & Stability
  { id: 'lp_bs1', name: 'Single-Leg Stand', sets: 2, repRange: '30s each', isCompound: false, day: 'balance_stability', programId: 'longevity_protocol' },
  { id: 'lp_bs2', name: 'Single-Leg Romanian Deadlift (light)', sets: 2, repRange: '8 each', isCompound: true, day: 'balance_stability', programId: 'longevity_protocol' },
  { id: 'lp_bs3', name: 'Heel-to-Toe Walk', sets: 2, repRange: '20 steps', isCompound: false, day: 'balance_stability', programId: 'longevity_protocol' },
  { id: 'lp_bs4', name: 'Side Plank', sets: 2, repRange: '20–30s each', isCompound: false, day: 'balance_stability', programId: 'longevity_protocol' },
  { id: 'lp_bs5', name: 'Front Plank', sets: 2, repRange: '30–45s', isCompound: false, day: 'balance_stability', programId: 'longevity_protocol' },
];

// ═══════════════════════════════════════════
//  EXTRA EXERCISES — Add during workout
// ═══════════════════════════════════════════

export const EXTRA_EXERCISES: Record<string, { id: string; name: string; defaultSets: number; repRange: string; isCompound: boolean }[]> = {
  // Dumbbell PPL
  ppl_dumbbell_push: [
    { id: 'extra_push1', name: 'Dumbbell Chest Fly', defaultSets: 3, repRange: '10–12', isCompound: false },
    { id: 'extra_push2', name: 'Dumbbell Front Raise', defaultSets: 3, repRange: '12–15', isCompound: false },
    { id: 'extra_push3', name: 'Triceps Kickback', defaultSets: 3, repRange: '10–12', isCompound: false },
  ],
  ppl_dumbbell_pull: [
    { id: 'extra_pull1', name: 'Dumbbell Shrug', defaultSets: 3, repRange: '12–15', isCompound: false },
    { id: 'extra_pull2', name: 'Concentration Curl', defaultSets: 3, repRange: '10–12', isCompound: false },
    { id: 'extra_pull3', name: 'Dumbbell Pullover', defaultSets: 3, repRange: '10–12', isCompound: true },
  ],
  ppl_dumbbell_legs: [
    { id: 'extra_legs1', name: 'Sumo Squat', defaultSets: 3, repRange: '10–12', isCompound: true },
    { id: 'extra_legs2', name: 'Step Up', defaultSets: 3, repRange: '10 each', isCompound: true },
    { id: 'extra_legs3', name: 'Seated Calf Raise', defaultSets: 3, repRange: '15–20', isCompound: false },
  ],
  // Dumbbell Full Body
  full_body_dumbbell_full_body: [
    { id: 'extra_fb1', name: 'Dumbbell Chest Fly', defaultSets: 3, repRange: '10–12', isCompound: false },
    { id: 'extra_fb2', name: 'Rear Delt Raise', defaultSets: 3, repRange: '12–15', isCompound: false },
    { id: 'extra_fb3', name: 'Hammer Curl', defaultSets: 3, repRange: '10–12', isCompound: false },
    { id: 'extra_fb4', name: 'Walking Lunges', defaultSets: 3, repRange: '10 each', isCompound: true },
  ],
  // EZ Bar PPL
  ppl_ezbar_push: [
    { id: 'extra_ez_push1', name: 'Dumbbell Front Raise', defaultSets: 3, repRange: '12–15', isCompound: false },
    { id: 'extra_ez_push2', name: 'Diamond Push-Up', defaultSets: 3, repRange: '10–15', isCompound: false },
  ],
  ppl_ezbar_pull: [
    { id: 'extra_ez_pull1', name: 'Dumbbell Hammer Curl', defaultSets: 3, repRange: '10–12', isCompound: false },
    { id: 'extra_ez_pull2', name: 'Dumbbell Shrug', defaultSets: 3, repRange: '12–15', isCompound: false },
  ],
  ppl_ezbar_legs: [
    { id: 'extra_ez_legs1', name: 'Dumbbell Hip Thrust', defaultSets: 3, repRange: '10–12', isCompound: true },
    { id: 'extra_ez_legs2', name: 'Step Up', defaultSets: 3, repRange: '10 each', isCompound: true },
  ],
  // EZ Bar Full Body
  full_body_ezbar_full_body: [
    { id: 'extra_ez_fb1', name: 'Dumbbell Lateral Raise', defaultSets: 3, repRange: '12–15', isCompound: false },
    { id: 'extra_ez_fb2', name: 'Dumbbell Rear Delt Raise', defaultSets: 3, repRange: '12–15', isCompound: false },
  ],
  // Ironmaster PPL
  ppl_ironmaster_push: [
    { id: 'extra_im_push1', name: 'Dumbbell Chest Fly', defaultSets: 3, repRange: '10–12', isCompound: false },
    { id: 'extra_im_push2', name: 'Cable Lateral Raise', defaultSets: 3, repRange: '12–15', isCompound: false },
  ],
  ppl_ironmaster_pull: [
    { id: 'extra_im_pull1', name: 'Dumbbell Pullover', defaultSets: 3, repRange: '10–12', isCompound: true },
    { id: 'extra_im_pull2', name: 'Dumbbell Hammer Curl', defaultSets: 3, repRange: '10–12', isCompound: false },
  ],
  ppl_ironmaster_legs: [
    { id: 'extra_im_legs1', name: 'Dumbbell Hip Thrust', defaultSets: 3, repRange: '10–12', isCompound: true },
    { id: 'extra_im_legs2', name: 'Seated Calf Raise', defaultSets: 3, repRange: '15–20', isCompound: false },
  ],
  // Ironmaster Full Body
  full_body_ironmaster_full_body: [
    { id: 'extra_im_fb1', name: 'Cable Face Pull', defaultSets: 3, repRange: '12–15', isCompound: false },
    { id: 'extra_im_fb2', name: 'Leg Curl', defaultSets: 3, repRange: '10–12', isCompound: false },
  ],
  // Longevity Protocol
  longevity_protocol_mobility_core: [
    { id: 'extra_lp_mc1', name: 'Foam Roller Thoracic', defaultSets: 2, repRange: '60s', isCompound: false },
    { id: 'extra_lp_mc2', name: 'World\'s Greatest Stretch', defaultSets: 2, repRange: '5 each', isCompound: false },
  ],
  longevity_protocol_strength_maint: [
    { id: 'extra_lp_sm1', name: 'Dumbbell Lateral Raise', defaultSets: 2, repRange: '12–15', isCompound: false },
    { id: 'extra_lp_sm2', name: 'Dumbbell Curl', defaultSets: 2, repRange: '10–12', isCompound: false },
  ],
  longevity_protocol_cardio_capacity: [
    { id: 'extra_lp_cc1', name: 'Jumping Jacks', defaultSets: 2, repRange: '30s', isCompound: false },
  ],
  longevity_protocol_balance_stability: [
    { id: 'extra_lp_bs1', name: 'Wall Sit', defaultSets: 2, repRange: '30s', isCompound: false },
    { id: 'extra_lp_bs2', name: 'Pallof Press (cable)', defaultSets: 2, repRange: '10 each', isCompound: false },
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
