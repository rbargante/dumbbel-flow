/**
 * Maps our exercise names to the best Wger API search terms.
 * The key is the normalized exercise name (lowercase, stripped).
 * The value is the search term to use with Wger's exercise search.
 */

const EXERCISE_SEARCH_MAP: Record<string, string> = {
  // Push
  'flat dumbbell bench press': 'dumbbell bench press',
  'incline dumbbell bench press': 'incline dumbbell press',
  'seated dumbbell shoulder press': 'dumbbell shoulder press',
  'dumbbell lateral raise': 'lateral raise dumbbell',
  'dumbbell overhead triceps extension': 'triceps extension dumbbell',

  // Pull
  'one-arm dumbbell row': 'one arm dumbbell row',
  'chest-supported dumbbell row': 'chest supported row',
  'dumbbell rear delt raise': 'reverse fly dumbbell',
  'dumbbell hammer curl': 'hammer curl',
  'dumbbell curl': 'bicep curl dumbbell',

  // Legs
  'goblet squat': 'goblet squat',
  'bulgarian split squat': 'bulgarian split squat',
  'dumbbell romanian deadlift': 'romanian deadlift dumbbell',
  'dumbbell hip thrust': 'hip thrust',
  'standing dumbbell calf raise': 'calf raise standing',
  'standing calf raise': 'calf raise standing',

  // EZ Bar
  'ez bar floor press': 'floor press barbell',
  'close-grip ez bar press': 'close grip bench press',
  'ez bar skullcrusher': 'skull crusher',
  'ez bar bent-over row': 'bent over row barbell',
  'ez bar curl': 'barbell curl',
  'reverse ez bar curl': 'reverse curl barbell',
  'ez bar romanian deadlift': 'romanian deadlift barbell',

  // Ironmaster
  'cable triceps pushdown': 'triceps pushdown cable',
  'chin-ups / pull-ups': 'pull ups',
  'one-arm cable row': 'cable row',
  'cable face pull': 'face pull cable',
  'dumbbell / ez bar curl': 'bicep curl',
  'cable row': 'seated cable row',
  'leg extension': 'leg extension',
  'leg curl': 'leg curl',

  // Complementary
  'posterior pelvic tilt hold': 'pelvic tilt',
  'dead bug': 'dead bug',
  'glute bridge hold': 'glute bridge',
  'wall slides': 'wall slide',
  'rear delt raise': 'reverse fly',
  'chin tucks': 'chin tuck',
  'single-leg stand': 'single leg balance',
  'step-back lunge': 'reverse lunge',
  'slow calf raises': 'calf raise',
  'farmer carry': 'farmer walk',

  // Longevity
  'pelvic tilt (posterior)': 'pelvic tilt',
  'bird dog': 'bird dog',
  'cat–cow spinal mobility': 'cat cow',
  'hip flexor stretch': 'hip flexor stretch',
  'thoracic extension on bench': 'thoracic extension',
  'dumbbell goblet squat': 'goblet squat',
  'wall push-ups': 'wall push up',
  'dumbbell row': 'dumbbell row',
  'brisk walk / jog intervals': 'walking',
  'jump rope': 'jump rope',
  'stair climb': 'stair climbing',
  'tandem walk (heel-to-toe)': 'tandem walk',
  'single-leg romanian deadlift': 'single leg deadlift',
  'bosu ball stand': 'balance board',
};

/**
 * Normalize an exercise name: lowercase, remove special chars except spaces
 */
export function normalizeExerciseName(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .trim();
}

/**
 * Get the best search term for an exercise name
 */
export function getSearchTerm(exerciseName: string): string {
  const normalized = normalizeExerciseName(exerciseName);
  return EXERCISE_SEARCH_MAP[normalized] || normalized;
}
