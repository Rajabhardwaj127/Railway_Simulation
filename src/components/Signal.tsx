import type { SignalDef } from '../types';
import type { SignalAspect } from '../types';

interface Props {
  signal: SignalDef;
  aspect: SignalAspect;
  onClick?: (sig: SignalDef) => void;
}

const ASPECT_COLORS: Record<SignalAspect, string> = {
  red: '#ff2020',
  yellow: '#ffcc00',
  green: '#00e05a',
  'double-yellow': '#ffcc00',
  off: '#1a1a2e',
};

const DIM = '#1e1e2e';

export default function Signal({ signal, aspect, onClick }: Props) {
  const { x, y, facing, type, label } = signal;
  const dir = facing === 'right' ? 1 : -1;

  const mastH = 32;
  const headW = 14;
  const headH = type === 'distant' ? 32 : 40;
  const armLen = 18;
  const headX = dir > 0 ? x + armLen : x - armLen - headW;
  const mastTop = y - mastH;
  const headY = mastTop - headH / 2 + 4;

  const lights: { color: string; isOn: boolean }[] = type === 'distant'
    ? [
        { color: '#00e05a', isOn: aspect === 'green' },
        { color: '#ffcc00', isOn: aspect === 'yellow' || aspect === 'double-yellow' },
      ]
    : [
        { color: '#00e05a', isOn: aspect === 'green' },
        { color: '#ffcc00', isOn: aspect === 'yellow' || aspect === 'double-yellow' },
        { color: '#ff2020', isOn: aspect === 'red' },
      ];

  const glowColor = aspect !== 'off' && aspect !== 'red'
    ? ASPECT_COLORS[aspect]
    : aspect === 'red'
    ? '#ff2020'
    : 'none';

  return (
    <g
      className="cursor-pointer"
      onClick={() => onClick?.(signal)}
      style={{ filter: aspect !== 'off' && aspect !== 'red' ? `drop-shadow(0 0 6px ${glowColor})` : undefined }}
    >
      {/* Mast */}
      <line
        x1={x} y1={y}
        x2={x} y2={mastTop}
        stroke="#9ca3af"
        strokeWidth={2}
      />
      {/* Arm */}
      <line
        x1={x} y1={mastTop}
        x2={x + dir * armLen} y2={mastTop}
        stroke="#9ca3af"
        strokeWidth={2}
      />
      {/* Head housing */}
      <rect
        x={headX}
        y={headY}
        width={headW}
        height={headH}
        rx={3}
        fill="#0f172a"
        stroke="#334155"
        strokeWidth={1}
      />
      {/* Lights */}
      {lights.map((lt, i) => {
        const cy = headY + 7 + i * (headH / lights.length);
        return (
          <circle
            key={i}
            cx={headX + headW / 2}
            cy={cy}
            r={4.5}
            fill={lt.isOn ? lt.color : DIM}
            opacity={lt.isOn ? 1 : 0.35}
          />
        );
      })}
      {/* Distant fishtail indicator */}
      {type === 'distant' && (
        <path
          d={`M${headX},${headY + headH} L${headX + headW / 2},${headY + headH + 6} L${headX + headW},${headY + headH}`}
          fill="none"
          stroke="#94a3b8"
          strokeWidth={1.5}
        />
      )}
      {/* Label */}
      <text
        x={x}
        y={y + 14}
        textAnchor="middle"
        fontSize={9}
        fontFamily="monospace"
        fill="#94a3b8"
        fontWeight="bold"
      >
        {label}
      </text>
      {/* Aspect badge */}
      <rect
        x={headX - 1}
        y={headY - 1}
        width={headW + 2}
        height={headH + 2}
        rx={3}
        fill="none"
        stroke={aspect === 'off' ? 'transparent' : ASPECT_COLORS[aspect]}
        strokeWidth={1}
        opacity={0.6}
      />
    </g>
  );
}
