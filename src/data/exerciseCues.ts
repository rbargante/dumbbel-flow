/**
 * Local exercise coaching cues — no network requests needed.
 * Keyed by normalized exercise name (lowercase, trimmed).
 */

export interface ExerciseCueEntry {
  cues: string[];
  mistakes?: string[];
}

const DEFAULT_CUES: ExerciseCueEntry = {
  cues: ['Control the movement', 'Breathe steadily', 'Full range of motion'],
  mistakes: ['Rushing reps', 'Holding breath'],
};

const CUES_MAP: Record<string, ExerciseCueEntry> = {
  // ─── PUSH ───
  'flat dumbbell bench press': {
    cues: ['Plant feet flat on floor', 'Retract shoulder blades', 'Press up and slightly inward', 'Control the descent (2–3s)'],
    mistakes: ['Flaring elbows past 75°', 'Bouncing off chest', 'Lifting hips off bench'],
  },
  'incline dumbbell bench press': {
    cues: ['Set bench to 30–45°', 'Drive through palms', 'Squeeze chest at top', 'Controlled eccentric'],
    mistakes: ['Bench angle too steep (becomes shoulder press)', 'Losing scapular retraction'],
  },
  'incline dumbbell press': {
    cues: ['Set bench to 30–45°', 'Drive through palms', 'Squeeze chest at top', 'Controlled eccentric'],
    mistakes: ['Bench angle too steep', 'Losing scapular retraction'],
  },
  'seated dumbbell shoulder press': {
    cues: ['Core tight, back against pad', 'Press overhead in slight arc', 'Don\'t lock elbows fully', 'Lower to ear level'],
    mistakes: ['Arching lower back excessively', 'Using momentum/leg drive'],
  },
  'dumbbell lateral raise': {
    cues: ['Slight bend in elbows', 'Lead with elbows, not hands', 'Raise to shoulder height', 'Control the negative'],
    mistakes: ['Swinging weights up', 'Shrugging traps', 'Going too heavy'],
  },
  'dumbbell overhead triceps extension': {
    cues: ['Keep elbows close to head', 'Lower behind head slowly', 'Full extension at top', 'Brace core throughout'],
    mistakes: ['Flaring elbows wide', 'Using shoulder momentum', 'Incomplete range of motion'],
  },
  // ─── PULL ───
  'one-arm dumbbell row': {
    cues: ['Flat back, core braced', 'Pull elbow toward hip', 'Squeeze shoulder blade at top', 'Full stretch at bottom'],
    mistakes: ['Rotating torso to lift', 'Rounding lower back', 'Pulling with bicep only'],
  },
  'chest-supported dumbbell row': {
    cues: ['Chest flat against incline bench', 'Pull elbows back, squeeze', 'Pause at top briefly', 'Full extension at bottom'],
    mistakes: ['Lifting chest off pad', 'Jerking weights up'],
  },
  'dumbbell rear delt raise': {
    cues: ['Hinge forward at hips', 'Slight elbow bend, thumbs down', 'Raise to shoulder height', 'Squeeze rear delts at top'],
    mistakes: ['Using momentum', 'Raising too high (traps take over)', 'Standing too upright'],
  },
  'dumbbell hammer curl': {
    cues: ['Neutral grip (palms facing in)', 'Keep elbows pinned at sides', 'Squeeze at top', 'Slow negative'],
    mistakes: ['Swinging body', 'Moving elbows forward'],
  },
  'dumbbell curl': {
    cues: ['Supinate wrists at top', 'Keep elbows fixed at sides', 'Full contraction at top', 'Control the descent'],
    mistakes: ['Using body momentum', 'Partial range of motion'],
  },
  // ─── LEGS ───
  'goblet squat': {
    cues: ['Hold dumbbell at chest', 'Sit back and down', 'Knees track over toes', 'Chest up, core braced'],
    mistakes: ['Leaning forward', 'Knees caving inward', 'Rising on toes'],
  },
  'bulgarian split squat': {
    cues: ['Rear foot on bench, laces down', 'Drop back knee straight down', 'Front shin stays vertical', 'Drive through front heel'],
    mistakes: ['Front knee drifting past toes', 'Leaning too far forward', 'Rear leg doing too much work'],
  },
  'dumbbell romanian deadlift': {
    cues: ['Soft knee bend (fixed)', 'Hinge at hips, push butt back', 'Dumbbells slide along thighs', 'Feel hamstring stretch, then drive hips forward'],
    mistakes: ['Rounding lower back', 'Bending knees too much (becomes squat)', 'Looking up (neck strain)'],
  },
  'dumbbell hip thrust': {
    cues: ['Upper back on bench', 'Drive through heels', 'Full hip extension at top', 'Chin tucked, eyes forward'],
    mistakes: ['Hyperextending lower back', 'Pushing through toes', 'Incomplete lockout'],
  },
  'standing dumbbell calf raise': {
    cues: ['Rise onto balls of feet', 'Pause at top for 1–2s', 'Full stretch at bottom', 'Keep legs straight'],
    mistakes: ['Bouncing reps', 'Partial range of motion', 'Bending knees'],
  },
  'standing calf raise': {
    cues: ['Rise onto balls of feet', 'Pause at top for 1–2s', 'Full stretch at bottom', 'Keep legs straight'],
    mistakes: ['Bouncing reps', 'Partial range of motion'],
  },
  // ─── EZ BAR ───
  'ez bar floor press': {
    cues: ['Lie on floor, knees bent', 'Lower until triceps touch floor', 'Pause briefly, then press', 'Keep wrists neutral'],
    mistakes: ['Bouncing arms off floor', 'Flaring elbows'],
  },
  'close-grip ez bar press': {
    cues: ['Narrow grip on inner angles', 'Elbows tucked close to body', 'Press straight up', 'Lower with control'],
    mistakes: ['Grip too narrow (wrist strain)', 'Flaring elbows'],
  },
  'ez bar skullcrusher': {
    cues: ['Arms vertical, lower to forehead', 'Only forearms move', 'Keep elbows stationary', 'Extend fully at top'],
    mistakes: ['Elbows flaring out', 'Moving upper arms', 'Using too much weight'],
  },
  'ez bar bent-over row': {
    cues: ['Hinge at 45°, flat back', 'Pull bar to lower chest', 'Squeeze shoulder blades', 'Controlled descent'],
    mistakes: ['Rounding back', 'Standing too upright', 'Using momentum'],
  },
  'ez bar curl': {
    cues: ['Grip on outer angles', 'Elbows pinned at sides', 'Full range of motion', 'Squeeze at top'],
    mistakes: ['Swinging body', 'Moving elbows forward'],
  },
  'reverse ez bar curl': {
    cues: ['Overhand/pronated grip', 'Keep elbows at sides', 'Controlled movement', 'Targets brachioradialis & forearms'],
    mistakes: ['Going too heavy', 'Using momentum'],
  },
  'ez bar romanian deadlift': {
    cues: ['Soft knee bend, hinge at hips', 'Bar slides along thighs', 'Feel hamstring stretch', 'Drive hips forward to stand'],
    mistakes: ['Rounding lower back', 'Bending knees too much'],
  },
  // ─── IRONMASTER ───
  'cable triceps pushdown': {
    cues: ['Elbows pinned at sides', 'Push down to full extension', 'Squeeze triceps at bottom', 'Slow return'],
    mistakes: ['Leaning over the bar', 'Elbows drifting forward'],
  },
  'chin-ups / pull-ups': {
    cues: ['Full hang at bottom', 'Pull until chin clears bar', 'Engage lats, not just arms', 'Controlled negative'],
    mistakes: ['Kipping/swinging', 'Partial range of motion', 'Shrugging shoulders'],
  },
  'one-arm cable row': {
    cues: ['Stand staggered stance', 'Pull to lower ribs', 'Squeeze shoulder blade back', 'Control the return'],
    mistakes: ['Rotating torso', 'Using body momentum'],
  },
  'cable face pull': {
    cues: ['Pull to face height', 'Externally rotate at end', 'Squeeze rear delts', 'Elbows high'],
    mistakes: ['Pulling too low', 'Using too much weight', 'No external rotation'],
  },
  'dumbbell / ez bar curl': {
    cues: ['Choose DB or EZ bar', 'Elbows fixed at sides', 'Full ROM with squeeze at top', 'Slow eccentric'],
    mistakes: ['Alternating without control', 'Using momentum'],
  },
  'leg extension': {
    cues: ['Sit back against pad', 'Extend fully, squeeze quad', 'Slow negative (3s)', 'Don\'t lock out violently'],
    mistakes: ['Swinging weight up', 'Lifting butt off seat'],
  },
  'leg curl': {
    cues: ['Lie flat, pad on lower calves', 'Curl toward glutes', 'Squeeze hamstrings at top', 'Slow release'],
    mistakes: ['Lifting hips off pad', 'Using momentum'],
  },
  'cable row': {
    cues: ['Sit tall, slight knee bend', 'Pull to lower chest', 'Squeeze shoulder blades together', 'Slow return to stretch'],
    mistakes: ['Rounding back', 'Leaning too far back'],
  },
  'cable lateral raise': {
    cues: ['Stand sideways to cable', 'Slight elbow bend', 'Raise to shoulder height', 'Control the return'],
    mistakes: ['Using too much weight', 'Shrugging'],
  },
  // ─── COMPLEMENTARY ───
  'posterior pelvic tilt hold': {
    cues: ['Lie on back, knees bent', 'Flatten lower back to floor', 'Engage abs and glutes', 'Hold steady, breathe'],
    mistakes: ['Holding breath', 'Using hip flexors instead of abs'],
  },
  'dead bug': {
    cues: ['Back flat on floor throughout', 'Opposite arm and leg extend', 'Move slowly and controlled', 'Exhale as you extend'],
    mistakes: ['Lower back lifting off floor', 'Moving too fast'],
  },
  'glute bridge hold': {
    cues: ['Drive through heels', 'Squeeze glutes at top', 'Keep ribs down', 'Hold position, breathe steadily'],
    mistakes: ['Hyperextending lower back', 'Pushing through toes'],
  },
  'wall slides': {
    cues: ['Back flat against wall', 'Arms in W position on wall', 'Slide up to Y, back to W', 'Keep contact with wall'],
    mistakes: ['Arching lower back', 'Losing wall contact with hands'],
  },
  'rear delt raise': {
    cues: ['Hinge forward at hips', 'Raise arms to sides', 'Squeeze shoulder blades', 'Thumbs pointing down or neutral'],
    mistakes: ['Using momentum', 'Standing too upright'],
  },
  'chin tucks': {
    cues: ['Pull chin straight back', 'Create double chin', 'Hold 5 seconds', 'Keep eyes level'],
    mistakes: ['Tilting head down', 'Jutting chin forward'],
  },
  'single-leg stand': {
    cues: ['Stand on one foot', 'Eyes forward, core tight', 'Keep hip level', 'Use arms for balance if needed'],
    mistakes: ['Leaning to one side', 'Looking down'],
  },
  'step-back lunge': {
    cues: ['Step back, drop knee down', 'Front shin stays vertical', 'Drive through front heel', 'Keep torso upright'],
    mistakes: ['Front knee caving inward', 'Leaning forward'],
  },
  'slow calf raises': {
    cues: ['3s up, 3s down', 'Full range of motion', 'Pause at top', 'Control every inch'],
    mistakes: ['Rushing the tempo', 'Partial ROM'],
  },
  'farmer carry': {
    cues: ['Heavy dumbbells at sides', 'Shoulders back and down', 'Walk with purpose, core tight', 'Short controlled steps'],
    mistakes: ['Leaning to one side', 'Shrugging shoulders up'],
  },
  // ─── LONGEVITY ───
  'pelvic tilt (posterior)': {
    cues: ['Lie supine, knees bent', 'Flatten lower back to floor', 'Engage lower abs', 'Hold 3–5s per rep'],
    mistakes: ['Using hip flexors', 'Holding breath'],
  },
  'bird dog': {
    cues: ['Start on all fours', 'Extend opposite arm and leg', 'Keep hips level', 'Hold 2–3s at top'],
    mistakes: ['Rotating hips', 'Arching lower back', 'Moving too fast'],
  },
  'cat–cow spinal mobility': {
    cues: ['Inhale: arch back (cow)', 'Exhale: round spine (cat)', 'Move through full range', 'Slow, controlled rhythm'],
    mistakes: ['Rushing movements', 'Only moving mid-back'],
  },
  'hip flexor stretch': {
    cues: ['Half-kneeling position', 'Tuck pelvis under (posterior tilt)', 'Lean forward gently', 'Feel stretch in front of hip'],
    mistakes: ['Arching lower back', 'Leaning too far forward'],
  },
  'thoracic extension on bench': {
    cues: ['Upper back on bench edge', 'Hands behind head', 'Extend backward over bench', 'Return with control'],
    mistakes: ['Extending from lower back', 'Going too fast'],
  },
  'standing dumbbell overhead press': {
    cues: ['Core braced, ribs down', 'Press straight overhead', 'Full lockout at top', 'Lower with control'],
    mistakes: ['Excessive back arch', 'Pressing forward instead of up'],
  },
  'brisk walking / march in place': {
    cues: ['High knees, pump arms', 'Stay light on feet', 'Maintain steady pace', 'Breathe rhythmically'],
  },
  'step-ups on bench': {
    cues: ['Full foot on bench', 'Drive through heel', 'Stand fully at top', 'Lower with control'],
    mistakes: ['Pushing off back foot', 'Leaning forward'],
  },
  'light intervals (optional)': {
    cues: ['30s effort, 30s rest', 'Keep intensity moderate', 'Focus on breathing recovery', 'Can use any modality'],
  },
  'single-leg romanian deadlift (light)': {
    cues: ['Soft knee on standing leg', 'Hinge at hip, reach back leg', 'Keep hips square', 'Controlled return'],
    mistakes: ['Opening hips to the side', 'Rounding back'],
  },
  'heel-to-toe walk': {
    cues: ['Place heel directly in front of toes', 'Arms out for balance', 'Look ahead, not down', 'Slow and controlled'],
    mistakes: ['Taking normal-width steps', 'Looking at feet'],
  },
  'side plank': {
    cues: ['Stack feet or stagger', 'Hips high, body straight', 'Top arm up or on hip', 'Breathe steadily'],
    mistakes: ['Hips sagging', 'Rotating forward'],
  },
  'front plank': {
    cues: ['Forearms on floor', 'Body straight from head to heels', 'Engage glutes and core', 'Breathe steadily'],
    mistakes: ['Hips sagging or piking', 'Holding breath'],
  },
  // ─── EXTRAS ───
  'dumbbell chest fly': {
    cues: ['Slight elbow bend throughout', 'Open arms wide, feel stretch', 'Squeeze chest to close', 'Control the descent'],
    mistakes: ['Straightening arms (becomes press)', 'Going too deep'],
  },
  'dumbbell front raise': {
    cues: ['Raise to shoulder height', 'Palms down or neutral', 'Keep core tight', 'Alternate or together'],
    mistakes: ['Swinging weights', 'Raising above shoulder level'],
  },
  'triceps kickback': {
    cues: ['Hinge forward, elbow at 90°', 'Extend arm fully back', 'Squeeze tricep at top', 'Only forearm moves'],
    mistakes: ['Dropping elbow', 'Using momentum'],
  },
  'dumbbell shrug': {
    cues: ['Shrug straight up', 'Hold at top 1–2s', 'Lower slowly', 'Don\'t roll shoulders'],
    mistakes: ['Rolling shoulders (injury risk)', 'Using too much weight'],
  },
  'concentration curl': {
    cues: ['Elbow braced on inner thigh', 'Curl with full supination', 'Squeeze at top', 'Slow negative'],
    mistakes: ['Moving upper arm', 'Using momentum'],
  },
  'dumbbell pullover': {
    cues: ['Upper back on bench', 'Arms slightly bent, lower behind head', 'Feel lats and chest stretch', 'Pull back over chest'],
    mistakes: ['Bending elbows too much', 'Dropping hips'],
  },
  'sumo squat': {
    cues: ['Wide stance, toes out', 'Squat straight down', 'Knees track over toes', 'Squeeze glutes at top'],
    mistakes: ['Knees caving in', 'Leaning forward'],
  },
  'step up': {
    cues: ['Full foot on step', 'Drive through heel', 'Stand fully at top', 'Control the step down'],
    mistakes: ['Pushing off back foot', 'Knee caving inward'],
  },
  'seated calf raise': {
    cues: ['Pad on lower thighs', 'Full ROM up and down', 'Pause at top', 'Targets soleus'],
    mistakes: ['Bouncing', 'Partial range'],
  },
  'walking lunges': {
    cues: ['Long stride forward', 'Back knee nearly touches floor', 'Torso upright', 'Drive through front heel'],
    mistakes: ['Short strides', 'Leaning forward'],
  },
  'diamond push-up': {
    cues: ['Hands together under chest', 'Elbows close to body', 'Lower until chest touches hands', 'Full extension at top'],
    mistakes: ['Flaring elbows', 'Sagging hips'],
  },
  'hammer curl': {
    cues: ['Neutral grip throughout', 'Elbows pinned', 'Full contraction', 'Slow eccentric'],
    mistakes: ['Swinging', 'Moving elbows'],
  },
  'arnold press': {
    cues: ['Start with palms facing you', 'Rotate as you press up', 'Full lockout overhead', 'Reverse on the way down'],
    mistakes: ['Not rotating fully', 'Arching back'],
  },
  'floor dumbbell press': {
    cues: ['Lie on floor, knees bent', 'Lower until triceps touch floor', 'Brief pause, then press', 'Eliminates excessive shoulder stretch'],
    mistakes: ['Bouncing off floor', 'Flaring elbows'],
  },
  'front raise': {
    cues: ['Raise to shoulder height', 'Control the movement', 'Alternate or together', 'Don\'t swing'],
    mistakes: ['Using momentum', 'Going above shoulder height'],
  },
  'bent-over dumbbell row': {
    cues: ['Hinge at hips, flat back', 'Pull to lower ribs', 'Squeeze at top', 'Control descent'],
    mistakes: ['Rounding back', 'Standing too upright'],
  },
  'band pull-apart': {
    cues: ['Arms straight in front', 'Pull band to chest level', 'Squeeze shoulder blades', 'Slow return'],
    mistakes: ['Bending elbows', 'Shrugging'],
  },
  'cross body curl': {
    cues: ['Curl across body toward opposite shoulder', 'Squeeze at top', 'Slow negative', 'Targets long head of bicep'],
    mistakes: ['Moving elbow', 'Using momentum'],
  },
  'reverse lunge': {
    cues: ['Step back, drop knee', 'Front shin vertical', 'Drive through front heel', 'Keep torso upright'],
    mistakes: ['Leaning forward', 'Front knee caving'],
  },
  'single leg rdl': {
    cues: ['Soft knee on standing leg', 'Hinge forward, reach back', 'Feel hamstring stretch', 'Return with control'],
    mistakes: ['Rounding back', 'Opening hips'],
  },
  'glute bridge': {
    cues: ['Feet flat, drive through heels', 'Squeeze glutes at top', 'Lower with control', 'Keep core engaged'],
    mistakes: ['Hyperextending back', 'Pushing through toes'],
  },
  'decline dumbbell press': {
    cues: ['Decline bench, feet hooked', 'Lower to lower chest', 'Press up and inward', 'Control the negative'],
    mistakes: ['Too steep of a decline', 'Flaring elbows'],
  },
  'stiff leg deadlift': {
    cues: ['Legs nearly straight', 'Hinge at hips', 'Feel deep hamstring stretch', 'Drive hips forward'],
    mistakes: ['Rounding back', 'Bending knees excessively'],
  },
  'overhead triceps extension': {
    cues: ['Elbows close to head', 'Lower behind head', 'Full extension at top', 'Core braced'],
    mistakes: ['Flaring elbows', 'Arching back'],
  },
  'dumbbell floor press': {
    cues: ['Lie on floor, knees bent', 'Lower until arms touch floor', 'Brief pause', 'Press to lockout'],
    mistakes: ['Bouncing arms', 'Losing tension at bottom'],
  },
  'dumbbell rdl': {
    cues: ['Soft knees, hinge at hips', 'DBs along thighs', 'Hamstring stretch', 'Drive hips forward'],
    mistakes: ['Rounding back', 'Too much knee bend'],
  },
  // ─── LONGEVITY EXTRAS ───
  'foam roller thoracic': {
    cues: ['Place roller under upper back', 'Arms crossed or behind head', 'Roll slowly up and down', 'Pause on tight spots'],
    mistakes: ['Rolling lower back', 'Going too fast'],
  },
  "world's greatest stretch": {
    cues: ['Lunge position', 'Rotate torso toward front leg', 'Reach arm to sky', 'Hold 3–5s each side'],
    mistakes: ['Rushing through', 'Not rotating fully'],
  },
  'jumping jacks': {
    cues: ['Full arm extension overhead', 'Land softly', 'Keep a steady rhythm', 'Breathe naturally'],
    mistakes: ['Landing heavily', 'Partial arm movement'],
  },
  'wall sit': {
    cues: ['Back flat against wall', 'Thighs parallel to floor', 'Knees at 90°', 'Hold and breathe'],
    mistakes: ['Sliding down too low', 'Pushing knees past toes'],
  },
  'pallof press (cable)': {
    cues: ['Stand sideways to cable', 'Press hands straight out', 'Resist rotation', 'Hold 2–3s extended'],
    mistakes: ['Rotating toward cable', 'Using too much weight'],
  },
  // ─── BLUEPRINT LONGEVITY ───
  'push-ups or db floor press': {
    cues: ['Choose push-ups (bodyweight) or DB floor press', 'Keep core tight throughout', 'Full range of motion', 'Control the eccentric'],
    mistakes: ['Sagging hips on push-ups', 'Bouncing off floor on presses'],
  },
  'db romanian deadlift': {
    cues: ['Soft knee bend, hinge at hips', 'DBs slide along thighs', 'Feel hamstring stretch', 'Drive hips forward to stand'],
    mistakes: ['Rounding lower back', 'Bending knees too much'],
  },
  'one-arm db row': {
    cues: ['Flat back, core braced', 'Pull elbow toward hip', 'Squeeze shoulder blade at top', 'Full stretch at bottom'],
    mistakes: ['Rotating torso', 'Pulling with bicep only'],
  },
  'db overhead press': {
    cues: ['Core braced, ribs down', 'Press straight overhead', 'Full lockout at top', 'Lower to ear level with control'],
    mistakes: ['Excessive back arch', 'Using leg drive'],
  },
  'plank or side plank': {
    cues: ['Choose front plank or side plank', 'Body straight from head to heels', 'Engage glutes and core', 'Breathe steadily throughout'],
    mistakes: ['Hips sagging or piking', 'Holding breath'],
  },
  'bird dog or dead bug': {
    cues: ['Choose bird dog (all fours) or dead bug (supine)', 'Opposite arm and leg extend', 'Keep hips and spine stable', 'Move slowly and controlled'],
    mistakes: ['Rotating hips', 'Arching lower back'],
  },
  'single-leg rdl or balance': {
    cues: ['Soft knee on standing leg', 'Hinge forward or hold balance', 'Keep hips square', 'Return with control'],
    mistakes: ['Opening hips to the side', 'Rounding back'],
  },
  'thoracic rotation': {
    cues: ['All fours or seated position', 'Hand behind head, rotate toward ceiling', 'Follow hand with eyes', 'Controlled return'],
    mistakes: ['Rotating from lower back', 'Rushing the movement'],
  },
  'hamstring / ankle stretch': {
    cues: ['Straight leg stretch for hamstrings', 'Wall or step stretch for ankles', 'Hold steady, breathe deeply', 'No bouncing'],
    mistakes: ['Rounding back to reach toes', 'Holding breath'],
  },
};

export function getExerciseCues(exerciseName: string): ExerciseCueEntry {
  const key = exerciseName.toLowerCase().trim();
  return CUES_MAP[key] || DEFAULT_CUES;
}
