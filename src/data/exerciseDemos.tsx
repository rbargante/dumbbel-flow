/**
 * Exercise Demo System — Premium Silhouette Animations
 * Smooth CSS keyframe SVG animations, fully offline, dark-theme optimized.
 */

type DemoType = 'press' | 'incline_press' | 'row' | 'curl' | 'squat' | 'deadlift' | 'lunge' | 'raise' | 'bridge' | 'stretch' | 'walk' | 'carry' | 'pullup' | 'cable' | 'core' | 'plank' | 'calf' | 'extension' | 'overhead' | 'fly' | 'shrug' | 'generic';

function getDemoType(name: string): DemoType {
  const n = name.toLowerCase();
  if (n.includes('incline') && n.includes('press')) return 'incline_press';
  if (n.includes('press') || n.includes('push-up') || n.includes('diamond push') || n.includes('floor press') || n.includes('skullcrusher')) return 'press';
  if (n.includes('fly') || n.includes('chest fly')) return 'fly';
  if (n.includes('overhead') && (n.includes('triceps') || n.includes('extension'))) return 'overhead';
  if (n.includes('row') || n.includes('pullover')) return 'row';
  if (n.includes('curl')) return 'curl';
  if (n.includes('squat') || n.includes('goblet') || n.includes('wall sit')) return 'squat';
  if (n.includes('deadlift') || n.includes('rdl') || n.includes('romanian') || n.includes('stiff leg')) return 'deadlift';
  if (n.includes('lunge') || n.includes('split squat') || n.includes('step')) return 'lunge';
  if (n.includes('lateral') || n.includes('front raise')) return 'raise';
  if (n.includes('shrug')) return 'shrug';
  if (n.includes('plank') || n.includes('pallof')) return 'plank';
  if (n.includes('dead bug') || n.includes('bird dog') || n.includes('pelvic tilt')) return 'core';
  if (n.includes('bridge') || n.includes('hip thrust')) return 'bridge';
  if (n.includes('stretch') || n.includes('cat') || n.includes('cow') || n.includes('thoracic') || n.includes('foam') || n.includes('wall slide') || n.includes('chin tuck') || n.includes('world') || n.includes('hip flexor')) return 'stretch';
  if (n.includes('walk') || n.includes('march') || n.includes('brisk') || n.includes('heel-to-toe') || n.includes('interval') || n.includes('jumping')) return 'walk';
  if (n.includes('carry') || n.includes('farmer')) return 'carry';
  if (n.includes('chin-up') || n.includes('pull-up')) return 'pullup';
  if (n.includes('cable') || n.includes('face pull') || n.includes('pushdown') || n.includes('triceps kick')) return 'cable';
  if (n.includes('calf')) return 'calf';
  if (n.includes('extension') || n.includes('leg curl') || n.includes('rear delt')) return 'extension';
  if (n.includes('stand')) return 'generic';
  return 'generic';
}

const ANIM_STYLES = `
  @keyframes dm-press { 0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)} }
  @keyframes dm-row { 0%,100%{transform:translateX(0) rotate(0)}50%{transform:translateX(-12px) rotate(-4deg)} }
  @keyframes dm-curl { 0%,100%{transform:rotate(0)}50%{transform:rotate(-50deg)} }
  @keyframes dm-squat { 0%,100%{transform:translateY(0)}50%{transform:translateY(14px)} }
  @keyframes dm-deadlift { 0%,100%{transform:rotate(0)}50%{transform:rotate(25deg)} }
  @keyframes dm-lunge { 0%,100%{transform:translateY(0)}50%{transform:translateY(10px)} }
  @keyframes dm-raise { 0%,100%{transform:rotate(0)}50%{transform:rotate(-55deg)} }
  @keyframes dm-bridge { 0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)} }
  @keyframes dm-stretch { 0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)} }
  @keyframes dm-walk { 0%{transform:translateX(-8px)}50%{transform:translateX(8px)}100%{transform:translateX(-8px)} }
  @keyframes dm-carry { 0%,100%{transform:translateY(0)}25%{transform:translateY(-3px)}75%{transform:translateY(3px)} }
  @keyframes dm-pullup { 0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)} }
  @keyframes dm-cable { 0%,100%{transform:translateX(0)}50%{transform:translateX(14px)} }
  @keyframes dm-core { 0%,100%{transform:scaleX(1) scaleY(1)}50%{transform:scaleX(1.03) scaleY(0.97)} }
  @keyframes dm-plank { 0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)} }
  @keyframes dm-calf { 0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)} }
  @keyframes dm-ext { 0%,100%{transform:rotate(0)}50%{transform:rotate(35deg)} }
  @keyframes dm-overhead { 0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)} }
  @keyframes dm-fly { 0%,100%{transform:scaleX(1)}50%{transform:scaleX(0.7)} }
  @keyframes dm-shrug { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }
  @keyframes dm-generic { 0%,100%{transform:scale(1)}50%{transform:scale(1.04)} }
  @keyframes dm-pulse { 0%,100%{opacity:0.15}50%{opacity:0.35} }
  @keyframes dm-glow { 0%,100%{opacity:0.4}50%{opacity:0.8} }
`;

/* ── Silhouette body parts ── */
function Head({ cx, cy, r = 10 }: { cx: number; cy: number; r?: number }) {
  return <ellipse cx={cx} cy={cy} rx={r} ry={r * 1.05} fill="currentColor" />;
}

function Torso({ x1, y1, x2, y2, w = 16 }: { x1: number; y1: number; x2: number; y2: number; w?: number }) {
  const dx = (x2 - x1);
  const dy = (y2 - y1);
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = (-dy / len) * w / 2;
  const ny = (dx / len) * w / 2;
  const tw = w * 0.55;
  const nx2 = (-dy / len) * tw / 2;
  const ny2 = (dx / len) * tw / 2;
  return (
    <polygon
      points={`${x1 + nx},${y1 + ny} ${x1 - nx},${y1 - ny} ${x2 - nx2},${y2 - ny2} ${x2 + nx2},${y2 + ny2}`}
      fill="currentColor"
    />
  );
}

function Limb({ x1, y1, x2, y2, w = 7 }: { x1: number; y1: number; x2: number; y2: number; w?: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={w} strokeLinecap="round" />;
}

function Dumbbell({ cx, cy, w = 22, h = 6 }: { cx: number; cy: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 4} width={w} height={h / 2} rx={h / 4} fill="currentColor" opacity={0.5} />
      <rect x={cx - w / 2 - 2} y={cy - h / 2} width={6} height={h} rx={2} fill="currentColor" opacity={0.7} />
      <rect x={cx + w / 2 - 4} y={cy - h / 2} width={6} height={h} rx={2} fill="currentColor" opacity={0.7} />
    </g>
  );
}

function Bar({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={4} strokeLinecap="round" opacity={0.6} />;
}

function Bench() {
  return (
    <g opacity={0.2}>
      <rect x={25} y={88} width={70} height={5} rx={2} fill="currentColor" />
      <rect x={30} y={93} width={5} height={12} rx={1} fill="currentColor" />
      <rect x={85} y={93} width={5} height={12} rx={1} fill="currentColor" />
    </g>
  );
}

function Floor() {
  return <line x1={10} y1={108} x2={110} y2={108} stroke="currentColor" strokeWidth={1.5} opacity={0.12} />;
}

function GlowCircle({ cx, cy, r = 30 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill="currentColor" opacity={0.06} style={{ animation: 'dm-pulse 3s ease-in-out infinite' }} />;
}

/* ── Demo animations ── */

function DemoPress() {
  return (
    <g>
      <Floor /><Bench />
      <GlowCircle cx={60} cy={50} r={40} />
      {/* Lying body */}
      <Head cx={35} cy={78} r={9} />
      <Torso x1={44} y1={80} x2={80} y2={82} w={14} />
      <Limb x1={80} y1={82} x2={90} y2={95} />
      <Limb x1={80} y1={82} x2={75} y2={95} />
      {/* Arms + dumbbells */}
      <g style={{ animation: 'dm-press 2.4s ease-in-out infinite', transformOrigin: '55px 65px' }}>
        <Limb x1={50} y1={78} x2={48} y2={58} />
        <Limb x1={65} y1={80} x2={67} y2={58} />
        <Dumbbell cx={48} cy={54} w={20} h={5} />
        <Dumbbell cx={67} cy={54} w={20} h={5} />
      </g>
    </g>
  );
}

function DemoInclinePress() {
  return (
    <g>
      <Floor />
      <GlowCircle cx={60} cy={50} r={40} />
      {/* Incline bench */}
      <g opacity={0.2}>
        <line x1={30} y1={95} x2={55} y2={55} stroke="currentColor" strokeWidth={6} strokeLinecap="round" />
        <line x1={55} y1={95} x2={80} y2={95} stroke="currentColor" strokeWidth={5} strokeLinecap="round" />
      </g>
      {/* Body on incline */}
      <Head cx={42} cy={48} r={9} />
      <Torso x1={48} y1={55} x2={62} y2={88} w={13} />
      <Limb x1={62} y1={88} x2={55} y2={105} />
      <Limb x1={62} y1={88} x2={72} y2={105} />
      {/* Arms pressing */}
      <g style={{ animation: 'dm-press 2.4s ease-in-out infinite', transformOrigin: '52px 55px' }}>
        <Limb x1={52} y1={60} x2={38} y2={42} />
        <Limb x1={52} y1={60} x2={65} y2={42} />
        <Dumbbell cx={38} cy={38} w={18} h={5} />
        <Dumbbell cx={65} cy={38} w={18} h={5} />
      </g>
    </g>
  );
}

function DemoRow() {
  return (
    <g>
      <Floor />
      <GlowCircle cx={60} cy={60} r={35} />
      {/* Bent-over body */}
      <Head cx={40} cy={38} r={9} />
      <Torso x1={48} y1={42} x2={72} y2={65} w={14} />
      <Limb x1={72} y1={65} x2={65} y2={105} />
      <Limb x1={72} y1={65} x2={80} y2={105} />
      {/* Pulling arm */}
      <g style={{ animation: 'dm-row 2.2s ease-in-out infinite', transformOrigin: '55px 52px' }}>
        <Limb x1={55} y1={50} x2={48} y2={68} />
        <Dumbbell cx={48} cy={70} w={18} h={5} />
      </g>
      {/* Support arm */}
      <Limb x1={55} y1={48} x2={42} y2={55} w={6} />
    </g>
  );
}

function DemoCurl() {
  return (
    <g>
      <Floor />
      <GlowCircle cx={60} cy={55} r={35} />
      {/* Standing body */}
      <Head cx={60} cy={20} r={9} />
      <Torso x1={60} y1={30} x2={60} y2={68} w={15} />
      <Limb x1={60} y1={68} x2={50} y2={105} />
      <Limb x1={60} y1={68} x2={70} y2={105} />
      {/* Static arm */}
      <Limb x1={53} y1={38} x2={48} y2={62} w={6} />
      {/* Curling arm */}
      <g style={{ animation: 'dm-curl 2s ease-in-out infinite', transformOrigin: '67px 38px' }}>
        <Limb x1={67} y1={38} x2={72} y2={60} />
        <Dumbbell cx={74} cy={62} w={16} h={5} />
      </g>
    </g>
  );
}

function DemoSquat() {
  return (
    <g>
      <Floor />
      <GlowCircle cx={60} cy={55} r={40} />
      <g style={{ animation: 'dm-squat 2.6s ease-in-out infinite', transformOrigin: '60px 105px' }}>
        <Head cx={60} cy={18} r={9} />
        <Torso x1={60} y1={28} x2={60} y2={62} w={15} />
        <Limb x1={60} y1={62} x2={48} y2={105} />
        <Limb x1={60} y1={62} x2={72} y2={105} />
        <Limb x1={54} y1={36} x2={42} y2={50} w={6} />
        <Limb x1={66} y1={36} x2={78} y2={50} w={6} />
        <Dumbbell cx={60} cy={42} w={14} h={5} />
      </g>
    </g>
  );
}

function DemoDeadlift() {
  return (
    <g>
      <Floor />
      <GlowCircle cx={60} cy={60} r={38} />
      <g style={{ animation: 'dm-deadlift 2.8s ease-in-out infinite', transformOrigin: '65px 105px' }}>
        <Head cx={48} cy={28} r={9} />
        <Torso x1={52} y1={36} x2={68} y2={68} w={14} />
        <Limb x1={68} y1={68} x2={60} y2={105} />
        <Limb x1={68} y1={68} x2={76} y2={105} />
        <Limb x1={56} y1={46} x2={46} y2={68} w={6} />
        <Limb x1={56} y1={46} x2={64} y2={68} w={6} />
        <Dumbbell cx={46} cy={70} w={16} h={5} />
        <Dumbbell cx={64} cy={70} w={16} h={5} />
      </g>
    </g>
  );
}

function DemoLunge() {
  return (
    <g>
      <Floor />
      <GlowCircle cx={60} cy={55} r={38} />
      <g style={{ animation: 'dm-lunge 2.4s ease-in-out infinite', transformOrigin: '60px 105px' }}>
        <Head cx={58} cy={18} r={9} />
        <Torso x1={58} y1={28} x2={58} y2={62} w={14} />
        <Limb x1={58} y1={62} x2={40} y2={105} />
        <Limb x1={58} y1={62} x2={78} y2={95} />
        <Limb x1={78} y1={95} x2={82} y2={105} w={6} />
        <Limb x1={52} y1={36} x2={45} y2={55} w={6} />
        <Limb x1={64} y1={36} x2={71} y2={55} w={6} />
        <Dumbbell cx={45} cy={57} w={14} h={4} />
        <Dumbbell cx={71} cy={57} w={14} h={4} />
      </g>
    </g>
  );
}

function DemoRaise() {
  return (
    <g>
      <Floor />
      <GlowCircle cx={60} cy={45} r={36} />
      <Head cx={60} cy={18} r={9} />
      <Torso x1={60} y1={28} x2={60} y2={68} w={15} />
      <Limb x1={60} y1={68} x2={50} y2={105} />
      <Limb x1={60} y1={68} x2={70} y2={105} />
      <g style={{ animation: 'dm-raise 2.2s ease-in-out infinite', transformOrigin: '60px 38px' }}>
        <Limb x1={53} y1={38} x2={32} y2={48} w={6} />
        <Limb x1={67} y1={38} x2={88} y2={48} w={6} />
        <Dumbbell cx={30} cy={50} w={12} h={4} />
        <Dumbbell cx={90} cy={50} w={12} h={4} />
      </g>
    </g>
  );
}

function DemoBridge() {
  return (
    <g>
      <Floor />
      <GlowCircle cx={60} cy={75} r={35} />
      {/* Lying on back */}
      <Head cx={25} cy={90} r={8} />
      <Torso x1={34} y1={88} x2={72} y2={88} w={12} />
      <g style={{ animation: 'dm-bridge 2.2s ease-in-out infinite', transformOrigin: '72px 100px' }}>
        <Limb x1={72} y1={88} x2={82} y2={100} />
        <Limb x1={82} y1={100} x2={78} y2={105} w={6} />
        <Limb x1={72} y1={88} x2={68} y2={100} />
        <Limb x1={68} y1={100} x2={65} y2={105} w={6} />
        {/* Hips lifting */}
        <ellipse cx={55} cy={82} rx={14} ry={4} fill="currentColor" opacity={0.4} />
      </g>
      <Limb x1={34} y1={85} x2={28} y2={92} w={5} />
      <Limb x1={34} y1={85} x2={40} y2={92} w={5} />
    </g>
  );
}

function DemoStretch() {
  return (
    <g>
      <Floor />
      <GlowCircle cx={60} cy={55} r={38} />
      <g style={{ animation: 'dm-stretch 3.5s ease-in-out infinite', transformOrigin: '60px 68px' }}>
        <Head cx={60} cy={18} r={9} />
        <Torso x1={60} y1={28} x2={60} y2={68} w={14} />
        <Limb x1={60} y1={68} x2={48} y2={105} />
        <Limb x1={60} y1={68} x2={72} y2={105} />
        <Limb x1={54} y1={36} x2={38} y2={24} w={6} />
        <Limb x1={66} y1={36} x2={82} y2={24} w={6} />
      </g>
    </g>
  );
}

function DemoWalk() {
  return (
    <g>
      <Floor />
      <GlowCircle cx={60} cy={55} r={36} />
      <g style={{ animation: 'dm-walk 1.6s ease-in-out infinite', transformOrigin: '60px 55px' }}>
        <Head cx={60} cy={18} r={9} />
        <Torso x1={60} y1={28} x2={60} y2={62} w={13} />
        <Limb x1={60} y1={62} x2={48} y2={105} />
        <Limb x1={60} y1={62} x2={72} y2={105} />
        <Limb x1={55} y1={36} x2={48} y2={48} w={5} />
        <Limb x1={65} y1={36} x2={72} y2={48} w={5} />
      </g>
    </g>
  );
}

function DemoCarry() {
  return (
    <g>
      <Floor />
      <GlowCircle cx={60} cy={55} r={36} />
      <g style={{ animation: 'dm-carry 1s ease-in-out infinite', transformOrigin: '60px 55px' }}>
        <Head cx={60} cy={16} r={9} />
        <Torso x1={60} y1={26} x2={60} y2={64} w={15} />
        <Limb x1={60} y1={64} x2={48} y2={105} />
        <Limb x1={60} y1={64} x2={72} y2={105} />
        <Limb x1={52} y1={34} x2={40} y2={58} w={6} />
        <Limb x1={68} y1={34} x2={80} y2={58} w={6} />
        <Dumbbell cx={38} cy={60} w={14} h={6} />
        <Dumbbell cx={82} cy={60} w={14} h={6} />
      </g>
    </g>
  );
}

function DemoPullup() {
  return (
    <g>
      <GlowCircle cx={60} cy={55} r={40} />
      {/* Bar */}
      <Bar x1={25} y1={8} x2={95} y2={8} />
      <g style={{ animation: 'dm-pullup 2.6s ease-in-out infinite', transformOrigin: '60px 8px' }}>
        <Head cx={60} cy={30} r={9} />
        <Torso x1={60} y1={40} x2={60} y2={72} w={14} />
        <Limb x1={60} y1={72} x2={50} y2={100} />
        <Limb x1={60} y1={72} x2={70} y2={100} />
        <Limb x1={54} y1={42} x2={42} y2={12} w={6} />
        <Limb x1={66} y1={42} x2={78} y2={12} w={6} />
      </g>
    </g>
  );
}

function DemoCable() {
  return (
    <g>
      <Floor />
      <GlowCircle cx={60} cy={55} r={36} />
      {/* Cable tower */}
      <rect x={92} y={5} width={6} height={100} rx={2} fill="currentColor" opacity={0.12} />
      <circle cx={95} cy={12} r={3} fill="currentColor" opacity={0.2} />
      <Head cx={55} cy={22} r={9} />
      <Torso x1={55} y1={32} x2={55} y2={68} w={14} />
      <Limb x1={55} y1={68} x2={45} y2={105} />
      <Limb x1={55} y1={68} x2={65} y2={105} />
      <g style={{ animation: 'dm-cable 2s ease-in-out infinite', transformOrigin: '55px 42px' }}>
        <Limb x1={55} y1={42} x2={78} y2={38} w={6} />
        <Limb x1={55} y1={42} x2={78} y2={42} w={6} />
        {/* Cable line */}
        <line x1={80} y1={38} x2={95} y2={12} stroke="currentColor" strokeWidth={1.5} opacity={0.25} strokeDasharray="4,3" />
      </g>
    </g>
  );
}

function DemoCore() {
  return (
    <g>
      <Floor />
      <GlowCircle cx={60} cy={70} r={35} />
      {/* Lying on back - dead bug style */}
      <Head cx={28} cy={80} r={8} />
      <Torso x1={36} y1={80} x2={75} y2={82} w={12} />
      <g style={{ animation: 'dm-core 2.8s ease-in-out infinite', transformOrigin: '55px 80px' }}>
        <Limb x1={75} y1={82} x2={82} y2={65} w={6} />
        <Limb x1={75} y1={82} x2={68} y2={65} w={6} />
        <Limb x1={45} y1={78} x2={42} y2={60} w={5} />
        <Limb x1={55} y1={78} x2={58} y2={60} w={5} />
      </g>
    </g>
  );
}

function DemoPlank() {
  return (
    <g>
      <Floor />
      <GlowCircle cx={60} cy={80} r={35} />
      <g style={{ animation: 'dm-plank 3s ease-in-out infinite', transformOrigin: '60px 90px' }}>
        <Head cx={28} cy={72} r={8} />
        <Torso x1={36} y1={76} x2={85} y2={82} w={11} />
        <Limb x1={28} y1={80} x2={28} y2={105} w={6} />
        <Limb x1={85} y1={82} x2={80} y2={105} w={6} />
        <Limb x1={85} y1={82} x2={92} y2={105} w={6} />
      </g>
    </g>
  );
}

function DemoCalf() {
  return (
    <g>
      <Floor />
      <GlowCircle cx={60} cy={50} r={34} />
      <g style={{ animation: 'dm-calf 1.6s ease-in-out infinite', transformOrigin: '60px 105px' }}>
        <Head cx={60} cy={16} r={9} />
        <Torso x1={60} y1={26} x2={60} y2={64} w={14} />
        <Limb x1={60} y1={64} x2={52} y2={95} />
        <Limb x1={60} y1={64} x2={68} y2={95} />
        {/* Feet on tiptoe */}
        <ellipse cx={52} cy={104} rx={5} ry={2} fill="currentColor" opacity={0.5} />
        <ellipse cx={68} cy={104} rx={5} ry={2} fill="currentColor" opacity={0.5} />
        <Limb x1={55} y1={34} x2={48} y2={48} w={5} />
        <Limb x1={65} y1={34} x2={72} y2={48} w={5} />
      </g>
    </g>
  );
}

function DemoExtension() {
  return (
    <g>
      <Floor /><Bench />
      <GlowCircle cx={60} cy={60} r={36} />
      {/* Seated */}
      <Head cx={55} cy={30} r={9} />
      <Torso x1={55} y1={40} x2={55} y2={75} w={14} />
      <Limb x1={55} y1={75} x2={65} y2={88} />
      <g style={{ animation: 'dm-ext 2.4s ease-in-out infinite', transformOrigin: '65px 88px' }}>
        <Limb x1={65} y1={88} x2={62} y2={105} w={7} />
      </g>
      <Limb x1={55} y1={75} x2={48} y2={88} />
      <Limb x1={48} y1={88} x2={45} y2={105} w={7} />
      <Limb x1={50} y1={48} x2={42} y2={58} w={5} />
      <Limb x1={60} y1={48} x2={68} y2={58} w={5} />
    </g>
  );
}

function DemoOverhead() {
  return (
    <g>
      <Floor />
      <GlowCircle cx={60} cy={40} r={36} />
      <Head cx={60} cy={22} r={9} />
      <Torso x1={60} y1={32} x2={60} y2={68} w={15} />
      <Limb x1={60} y1={68} x2={50} y2={105} />
      <Limb x1={60} y1={68} x2={70} y2={105} />
      <g style={{ animation: 'dm-overhead 2.2s ease-in-out infinite', transformOrigin: '60px 38px' }}>
        <Limb x1={54} y1={38} x2={52} y2={18} w={6} />
        <Limb x1={66} y1={38} x2={68} y2={18} w={6} />
        <Dumbbell cx={60} cy={12} w={22} h={6} />
      </g>
    </g>
  );
}

function DemoFly() {
  return (
    <g>
      <Floor /><Bench />
      <GlowCircle cx={60} cy={55} r={38} />
      <Head cx={35} cy={78} r={9} />
      <Torso x1={44} y1={80} x2={80} y2={82} w={13} />
      <Limb x1={80} y1={82} x2={88} y2={95} />
      <Limb x1={80} y1={82} x2={75} y2={95} />
      <g style={{ animation: 'dm-fly 2.6s ease-in-out infinite', transformOrigin: '60px 75px' }}>
        <Limb x1={50} y1={78} x2={30} y2={55} w={6} />
        <Limb x1={68} y1={80} x2={88} y2={55} w={6} />
        <Dumbbell cx={28} cy={52} w={14} h={5} />
        <Dumbbell cx={90} cy={52} w={14} h={5} />
      </g>
    </g>
  );
}

function DemoShrug() {
  return (
    <g>
      <Floor />
      <GlowCircle cx={60} cy={45} r={34} />
      <g style={{ animation: 'dm-shrug 1.6s ease-in-out infinite', transformOrigin: '60px 55px' }}>
        <Head cx={60} cy={18} r={9} />
        <Torso x1={60} y1={28} x2={60} y2={66} w={16} />
        <Limb x1={52} y1={34} x2={40} y2={62} w={7} />
        <Limb x1={68} y1={34} x2={80} y2={62} w={7} />
        <Dumbbell cx={38} cy={64} w={14} h={5} />
        <Dumbbell cx={82} cy={64} w={14} h={5} />
      </g>
      <Limb x1={60} y1={66} x2={50} y2={105} />
      <Limb x1={60} y1={66} x2={70} y2={105} />
    </g>
  );
}

function DemoGeneric() {
  return (
    <g>
      <Floor />
      <GlowCircle cx={60} cy={55} r={38} />
      <g style={{ animation: 'dm-generic 2.5s ease-in-out infinite', transformOrigin: '60px 60px' }}>
        <Head cx={60} cy={18} r={9} />
        <Torso x1={60} y1={28} x2={60} y2={66} w={15} />
        <Limb x1={60} y1={66} x2={48} y2={105} />
        <Limb x1={60} y1={66} x2={72} y2={105} />
        <Limb x1={54} y1={38} x2={40} y2={50} w={6} />
        <Limb x1={66} y1={38} x2={80} y2={50} w={6} />
      </g>
    </g>
  );
}

const DEMO_MAP: Record<DemoType, () => JSX.Element> = {
  press: DemoPress,
  incline_press: DemoInclinePress,
  row: DemoRow,
  curl: DemoCurl,
  squat: DemoSquat,
  deadlift: DemoDeadlift,
  lunge: DemoLunge,
  raise: DemoRaise,
  bridge: DemoBridge,
  stretch: DemoStretch,
  walk: DemoWalk,
  carry: DemoCarry,
  pullup: DemoPullup,
  cable: DemoCable,
  core: DemoCore,
  plank: DemoPlank,
  calf: DemoCalf,
  extension: DemoExtension,
  overhead: DemoOverhead,
  fly: DemoFly,
  shrug: DemoShrug,
  generic: DemoGeneric,
};

export function ExerciseDemoAnimation({ exerciseName }: { exerciseName: string }) {
  const type = getDemoType(exerciseName);
  const Component = DEMO_MAP[type];
  return (
    <>
      <style>{ANIM_STYLES}</style>
      <svg
        viewBox="0 0 120 115"
        className="w-full h-full text-primary"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Component />
      </svg>
    </>
  );
}

export { getDemoType };
export type { DemoType };
