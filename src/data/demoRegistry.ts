/**
 * Exercise Demo Registry
 * 
 * Maps exercise names to their demo media files.
 * Supported formats: 'lottie' (.json), 'video' (.mp4/.webm), 'gif' (.gif)
 * 
 * To add a demo:
 * 1. Place the file in public/demos/  (e.g. public/demos/goblet-squat.mp4)
 * 2. Add an entry below mapping the exercise name to the file.
 * 
 * The key is the EXACT exercise name (case-insensitive match is done at lookup).
 */

export interface DemoEntry {
  type: 'lottie' | 'video' | 'gif';
  src: string; // path relative to public/, e.g. "/demos/goblet-squat.mp4"
}

/**
 * Add your demos here. Example:
 * 
 * 'Goblet Squat': { type: 'video', src: '/demos/goblet-squat.mp4' },
 * 'Dumbbell Curl': { type: 'gif', src: '/demos/dumbbell-curl.gif' },
 * 'Dead Bug': { type: 'lottie', src: '/demos/dead-bug.json' },
 */
const DEMO_REGISTRY: Record<string, DemoEntry> = {
  // ── Add entries below as you upload files ──
  // 'Goblet Squat': { type: 'video', src: '/demos/goblet-squat.mp4' },
};

/** Case-insensitive lookup */
export function getDemoForExercise(exerciseName: string): DemoEntry | null {
  // Direct match
  if (DEMO_REGISTRY[exerciseName]) return DEMO_REGISTRY[exerciseName];
  // Case-insensitive
  const key = Object.keys(DEMO_REGISTRY).find(
    k => k.toLowerCase() === exerciseName.toLowerCase()
  );
  return key ? DEMO_REGISTRY[key] : null;
}

/** Stats for settings debug */
export function getDemoStats() {
  const entries = Object.keys(DEMO_REGISTRY);
  return {
    totalWithDemo: entries.length,
    entries,
  };
}
