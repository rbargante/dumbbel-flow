/**
 * Exercise Demo System
 * Inline SVG animations — no external assets, fully offline.
 * Each demo is a looping CSS animation rendered as React SVG.
 */

type DemoType = 'press' | 'row' | 'curl' | 'squat' | 'deadlift' | 'lunge' | 'raise' | 'bridge' | 'stretch' | 'walk' | 'carry' | 'pullup' | 'cable' | 'core' | 'generic';

// Map exercise names to demo animation types
function getDemoType(name: string): DemoType {
  const n = name.toLowerCase();
  if (n.includes('press') || n.includes('push-up') || n.includes('diamond push') || n.includes('fly') || n.includes('skullcrusher') || n.includes('floor press')) return 'press';
  if (n.includes('row') || n.includes('pullover')) return 'row';
  if (n.includes('curl')) return 'curl';
  if (n.includes('squat') || n.includes('goblet')) return 'squat';
  if (n.includes('deadlift') || n.includes('rdl') || n.includes('romanian') || n.includes('stiff leg')) return 'deadlift';
  if (n.includes('lunge') || n.includes('split squat') || n.includes('step')) return 'lunge';
  if (n.includes('raise') || n.includes('shrug') || n.includes('front raise') || n.includes('lateral')) return 'raise';
  if (n.includes('plank') || n.includes('dead bug') || n.includes('bird dog') || n.includes('pallof')) return 'core';
  if (n.includes('bridge') || n.includes('hip thrust') || n.includes('pelvic tilt')) return 'bridge';
  if (n.includes('stretch') || n.includes('cat') || n.includes('cow') || n.includes('thoracic') || n.includes('foam') || n.includes('wall slide') || n.includes('chin tuck') || n.includes('world')) return 'stretch';
  if (n.includes('walk') || n.includes('march') || n.includes('brisk') || n.includes('heel-to-toe') || n.includes('interval') || n.includes('jumping')) return 'walk';
  if (n.includes('carry') || n.includes('farmer')) return 'carry';
  if (n.includes('chin-up') || n.includes('pull-up')) return 'pullup';
  if (n.includes('cable') || n.includes('face pull') || n.includes('pushdown') || n.includes('triceps kick')) return 'cable';
  if (n.includes('calf') || n.includes('stand') || n.includes('wall sit') || n.includes('extension') || n.includes('leg curl')) return 'generic';
  return 'generic';
}

const STYLES = `
@keyframes demo-press {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes demo-row {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-10px); }
}
@keyframes demo-curl {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-40deg); }
}
@keyframes demo-squat {
  0%, 100% { transform: translateY(0) scaleY(1); }
  50% { transform: translateY(10px) scaleY(0.85); }
}
@keyframes demo-deadlift {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(30deg); }
}
@keyframes demo-lunge {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}
@keyframes demo-raise {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-45deg); }
}
@keyframes demo-core {
  0%, 100% { transform: scaleX(1); }
  50% { transform: scaleX(1.05); }
}
@keyframes demo-bridge {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes demo-stretch {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}
@keyframes demo-walk {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(6px); }
  50% { transform: translateX(0); }
  75% { transform: translateX(-6px); }
}
@keyframes demo-carry {
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-2px); }
  75% { transform: translateY(2px); }
}
@keyframes demo-pullup {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}
@keyframes demo-cable {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(10px); }
}
@keyframes demo-generic {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}
`;

// Stick figure SVG components per type
function StickPress() {
  return (
    <g style={{ animation: 'demo-press 2s ease-in-out infinite', transformOrigin: '50% 50%' }}>
      {/* Body */}
      <circle cx="60" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="38" x2="60" y2="70" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="70" x2="48" y2="90" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="70" x2="72" y2="90" stroke="currentColor" strokeWidth="2.5" />
      {/* Arms pressing up */}
      <line x1="60" y1="48" x2="38" y2="35" stroke="currentColor" strokeWidth="2.5" />
      <line x1="38" y1="35" x2="35" y2="20" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="48" x2="82" y2="35" stroke="currentColor" strokeWidth="2.5" />
      <line x1="82" y1="35" x2="85" y2="20" stroke="currentColor" strokeWidth="2.5" />
      {/* Dumbbells */}
      <rect x="28" y="16" width="14" height="5" rx="2" fill="currentColor" opacity="0.7" />
      <rect x="78" y="16" width="14" height="5" rx="2" fill="currentColor" opacity="0.7" />
    </g>
  );
}

function StickRow() {
  return (
    <g style={{ animation: 'demo-row 2s ease-in-out infinite', transformOrigin: '50% 50%' }}>
      <circle cx="65" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="65" y1="38" x2="55" y2="65" stroke="currentColor" strokeWidth="2.5" />
      <line x1="55" y1="65" x2="45" y2="90" stroke="currentColor" strokeWidth="2.5" />
      <line x1="55" y1="65" x2="70" y2="90" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="48" x2="40" y2="55" stroke="currentColor" strokeWidth="2.5" />
      <line x1="40" y1="55" x2="35" y2="70" stroke="currentColor" strokeWidth="2.5" />
      <rect x="30" y="67" width="10" height="4" rx="1.5" fill="currentColor" opacity="0.7" />
    </g>
  );
}

function StickCurl() {
  return (
    <g>
      <circle cx="60" cy="25" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="33" x2="60" y2="65" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="65" x2="50" y2="90" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="65" x2="70" y2="90" stroke="currentColor" strokeWidth="2.5" />
      {/* Static arm */}
      <line x1="60" y1="42" x2="45" y2="55" stroke="currentColor" strokeWidth="2.5" />
      <line x1="45" y1="55" x2="43" y2="65" stroke="currentColor" strokeWidth="2.5" />
      {/* Curling arm */}
      <g style={{ animation: 'demo-curl 1.8s ease-in-out infinite', transformOrigin: '75px 42px' }}>
        <line x1="60" y1="42" x2="75" y2="55" stroke="currentColor" strokeWidth="2.5" />
        <line x1="75" y1="55" x2="77" y2="65" stroke="currentColor" strokeWidth="2.5" />
        <rect x="73" y="63" width="8" height="4" rx="1.5" fill="currentColor" opacity="0.7" />
      </g>
    </g>
  );
}

function StickSquat() {
  return (
    <g style={{ animation: 'demo-squat 2.2s ease-in-out infinite', transformOrigin: '60px 90px' }}>
      <circle cx="60" cy="22" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="30" x2="60" y2="60" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="60" x2="48" y2="88" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="60" x2="72" y2="88" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="40" x2="42" y2="50" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="40" x2="78" y2="50" stroke="currentColor" strokeWidth="2.5" />
      <rect x="37" y="47" width="10" height="4" rx="1.5" fill="currentColor" opacity="0.7" />
      <rect x="73" y="47" width="10" height="4" rx="1.5" fill="currentColor" opacity="0.7" />
    </g>
  );
}

function StickDeadlift() {
  return (
    <g style={{ animation: 'demo-deadlift 2.4s ease-in-out infinite', transformOrigin: '60px 88px' }}>
      <circle cx="60" cy="22" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="30" x2="60" y2="60" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="60" x2="50" y2="88" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="60" x2="70" y2="88" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="42" x2="48" y2="60" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="42" x2="72" y2="60" stroke="currentColor" strokeWidth="2.5" />
      <rect x="42" y="58" width="8" height="4" rx="1.5" fill="currentColor" opacity="0.7" />
      <rect x="70" y="58" width="8" height="4" rx="1.5" fill="currentColor" opacity="0.7" />
    </g>
  );
}

function StickLunge() {
  return (
    <g style={{ animation: 'demo-lunge 2s ease-in-out infinite', transformOrigin: '60px 88px' }}>
      <circle cx="60" cy="22" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="30" x2="60" y2="58" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="58" x2="42" y2="88" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="58" x2="78" y2="88" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="40" x2="50" y2="55" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="40" x2="70" y2="55" stroke="currentColor" strokeWidth="2.5" />
    </g>
  );
}

function StickRaise() {
  return (
    <g>
      <circle cx="60" cy="25" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="33" x2="60" y2="65" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="65" x2="50" y2="90" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="65" x2="70" y2="90" stroke="currentColor" strokeWidth="2.5" />
      <g style={{ animation: 'demo-raise 2s ease-in-out infinite', transformOrigin: '60px 42px' }}>
        <line x1="60" y1="42" x2="38" y2="50" stroke="currentColor" strokeWidth="2.5" />
        <rect x="32" y="48" width="8" height="3" rx="1" fill="currentColor" opacity="0.7" />
        <line x1="60" y1="42" x2="82" y2="50" stroke="currentColor" strokeWidth="2.5" />
        <rect x="80" y="48" width="8" height="3" rx="1" fill="currentColor" opacity="0.7" />
      </g>
    </g>
  );
}

function StickCore() {
  return (
    <g style={{ animation: 'demo-core 2.5s ease-in-out infinite', transformOrigin: '60px 50px' }}>
      {/* Plank position */}
      <circle cx="30" cy="42" r="7" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="37" y1="44" x2="85" y2="50" stroke="currentColor" strokeWidth="2.5" />
      <line x1="30" y1="49" x2="30" y2="68" stroke="currentColor" strokeWidth="2.5" />
      <line x1="85" y1="50" x2="82" y2="70" stroke="currentColor" strokeWidth="2.5" />
      <line x1="85" y1="50" x2="92" y2="70" stroke="currentColor" strokeWidth="2.5" />
    </g>
  );
}

function StickBridge() {
  return (
    <g>
      {/* Lying position with hips lifting */}
      <circle cx="25" cy="55" r="7" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="32" y1="55" x2="70" y2="55" stroke="currentColor" strokeWidth="2.5" />
      <g style={{ animation: 'demo-bridge 2s ease-in-out infinite', transformOrigin: '70px 70px' }}>
        <line x1="50" y1="55" x2="50" y2="40" stroke="currentColor" strokeWidth="2.5" />
        <line x1="70" y1="55" x2="80" y2="70" stroke="currentColor" strokeWidth="2.5" />
        <line x1="70" y1="55" x2="65" y2="70" stroke="currentColor" strokeWidth="2.5" />
      </g>
    </g>
  );
}

function StickStretch() {
  return (
    <g style={{ animation: 'demo-stretch 3s ease-in-out infinite', transformOrigin: '60px 60px' }}>
      <circle cx="60" cy="22" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="30" x2="60" y2="62" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="62" x2="48" y2="88" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="62" x2="72" y2="88" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="40" x2="40" y2="30" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="40" x2="80" y2="30" stroke="currentColor" strokeWidth="2.5" />
    </g>
  );
}

function StickWalk() {
  return (
    <g style={{ animation: 'demo-walk 1.2s ease-in-out infinite', transformOrigin: '60px 50px' }}>
      <circle cx="60" cy="18" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="26" x2="60" y2="55" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="55" x2="48" y2="85" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="55" x2="72" y2="85" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="38" x2="48" y2="48" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="38" x2="72" y2="48" stroke="currentColor" strokeWidth="2.5" />
    </g>
  );
}

function StickCarry() {
  return (
    <g style={{ animation: 'demo-carry 0.8s ease-in-out infinite', transformOrigin: '60px 50px' }}>
      <circle cx="60" cy="18" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="26" x2="60" y2="55" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="55" x2="50" y2="85" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="55" x2="70" y2="85" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="38" x2="42" y2="55" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="38" x2="78" y2="55" stroke="currentColor" strokeWidth="2.5" />
      <rect x="36" y="53" width="10" height="5" rx="1.5" fill="currentColor" opacity="0.7" />
      <rect x="74" y="53" width="10" height="5" rx="1.5" fill="currentColor" opacity="0.7" />
    </g>
  );
}

function StickPullup() {
  return (
    <g style={{ animation: 'demo-pullup 2.2s ease-in-out infinite', transformOrigin: '60px 10px' }}>
      {/* Bar */}
      <line x1="30" y1="10" x2="90" y2="10" stroke="currentColor" strokeWidth="3" opacity="0.5" />
      <circle cx="60" cy="28" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="36" x2="60" y2="65" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="65" x2="50" y2="88" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="65" x2="70" y2="88" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="42" x2="45" y2="15" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="42" x2="75" y2="15" stroke="currentColor" strokeWidth="2.5" />
    </g>
  );
}

function StickCable() {
  return (
    <g style={{ animation: 'demo-cable 2s ease-in-out infinite', transformOrigin: '60px 50px' }}>
      {/* Cable line */}
      <line x1="90" y1="10" x2="75" y2="45" stroke="currentColor" strokeWidth="1.5" opacity="0.4" strokeDasharray="3,3" />
      <circle cx="55" cy="25" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="55" y1="33" x2="55" y2="65" stroke="currentColor" strokeWidth="2.5" />
      <line x1="55" y1="65" x2="45" y2="88" stroke="currentColor" strokeWidth="2.5" />
      <line x1="55" y1="65" x2="65" y2="88" stroke="currentColor" strokeWidth="2.5" />
      <line x1="55" y1="45" x2="75" y2="45" stroke="currentColor" strokeWidth="2.5" />
    </g>
  );
}

function StickGeneric() {
  return (
    <g style={{ animation: 'demo-generic 2s ease-in-out infinite', transformOrigin: '60px 50px' }}>
      <circle cx="60" cy="22" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="30" x2="60" y2="60" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="60" x2="48" y2="88" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="60" x2="72" y2="88" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="42" x2="42" y2="52" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="42" x2="78" y2="52" stroke="currentColor" strokeWidth="2.5" />
    </g>
  );
}

const DEMO_COMPONENTS: Record<DemoType, () => JSX.Element> = {
  press: StickPress,
  row: StickRow,
  curl: StickCurl,
  squat: StickSquat,
  deadlift: StickDeadlift,
  lunge: StickLunge,
  raise: StickRaise,
  core: StickCore,
  bridge: StickBridge,
  stretch: StickStretch,
  walk: StickWalk,
  carry: StickCarry,
  pullup: StickPullup,
  cable: StickCable,
  generic: StickGeneric,
};

export function ExerciseDemoAnimation({ exerciseName }: { exerciseName: string }) {
  const type = getDemoType(exerciseName);
  const DemoComponent = DEMO_COMPONENTS[type];
  return (
    <>
      <style>{STYLES}</style>
      <svg viewBox="0 0 120 100" className="w-full h-full text-primary" xmlns="http://www.w3.org/2000/svg">
        <DemoComponent />
      </svg>
    </>
  );
}

export { getDemoType };
export type { DemoType };
