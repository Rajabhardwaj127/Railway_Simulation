import type { SignalAspect, PointPosition, TrainPosition } from '../types';
import { SIGNALS, POINTS, TRAINS, MAIN_Y, LOOP_Y, LEFT_SWITCH_X, RIGHT_SWITCH_X, CANVAS_W, CANVAS_H } from '../data/trackLayout';
import Signal from './Signal';
import PointSwitch from './PointSwitch';
import TrainCar from './TrainCar';

interface Props {
  signals: Record<string, SignalAspect>;
  points: Record<string, PointPosition>;
  trains: TrainPosition[];
  onSignalClick?: (id: string) => void;
}

const PLATFORM_X1 = LEFT_SWITCH_X + 80;
const PLATFORM_X2 = RIGHT_SWITCH_X - 80;
const PLATFORM_H = 12;

export default function TrackCanvas({ signals, points, trains, onSignalClick }: Props) {
  const loopEntryX = LEFT_SWITCH_X + 65;
  const loopExitX = RIGHT_SWITCH_X - 65;

  const trackPath = (d: string) => (
    <g>
      {/* Rail shadow */}
      <path d={d} fill="none" stroke="#0f172a" strokeWidth={10} strokeLinecap="round" />
      {/* Sleepers (approximated with dashes) */}
      <path d={d} fill="none" stroke="#374151" strokeWidth={8} strokeLinecap="round" strokeDasharray="4 12" />
      {/* Rails */}
      <path d={d} fill="none" stroke="#64748b" strokeWidth={3} strokeLinecap="round" />
      <path d={d} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeLinecap="round" opacity={0.7} />
    </g>
  );

  const mainLinePath = `M0,${MAIN_Y} L${LEFT_SWITCH_X},${MAIN_Y}`;
  const mainLinePath2 = `M${LEFT_SWITCH_X},${MAIN_Y} L${RIGHT_SWITCH_X},${MAIN_Y}`;
  const mainLinePath3 = `M${RIGHT_SWITCH_X},${MAIN_Y} L${CANVAS_W},${MAIN_Y}`;

  const loopLeftCurve = `M${LEFT_SWITCH_X},${MAIN_Y} C${LEFT_SWITCH_X + 25},${MAIN_Y} ${LEFT_SWITCH_X + 60},${LOOP_Y} ${loopEntryX},${LOOP_Y}`;
  const loopStraight = `M${loopEntryX},${LOOP_Y} L${loopExitX},${LOOP_Y}`;
  const loopRightCurve = `M${loopExitX},${LOOP_Y} C${RIGHT_SWITCH_X - 60},${LOOP_Y} ${RIGHT_SWITCH_X - 25},${MAIN_Y} ${RIGHT_SWITCH_X},${MAIN_Y}`;

  return (
    <svg
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      className="w-full"
      style={{ background: 'transparent' }}
    >
      {/* Gradient background */}
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0f1e" />
          <stop offset="100%" stopColor="#0d1b2a" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Train clipping */}
        <clipPath id="canvasClip">
          <rect x={0} y={0} width={CANVAS_W} height={CANVAS_H} />
        </clipPath>
      </defs>

      <rect x={0} y={0} width={CANVAS_W} height={CANVAS_H} fill="url(#bgGrad)" rx={8} />

      {/* Grid lines subtle */}
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          x1={i * 100} y1={0}
          x2={i * 100} y2={CANVAS_H}
          stroke="#ffffff"
          strokeWidth={0.3}
          opacity={0.04}
        />
      ))}

      {/* Ground line */}
      <rect x={0} y={CANVAS_H - 30} width={CANVAS_W} height={30} fill="#0c1524" opacity={0.5} />

      {/* Track ballast (main line) */}
      <rect x={0} y={MAIN_Y - 6} width={CANVAS_W} height={12} fill="#1e293b" opacity={0.6} rx={2} />

      {/* Platform */}
      <rect
        x={PLATFORM_X1}
        y={LOOP_Y - PLATFORM_H}
        width={PLATFORM_X2 - PLATFORM_X1}
        height={PLATFORM_H}
        fill="#1e3a5f"
        stroke="#2d6a9f"
        strokeWidth={1}
        rx={2}
        opacity={0.85}
      />
      <text
        x={(PLATFORM_X1 + PLATFORM_X2) / 2}
        y={LOOP_Y - PLATFORM_H - 5}
        textAnchor="middle"
        fontSize={9}
        fill="#60a5fa"
        fontFamily="sans-serif"
        letterSpacing={2}
        opacity={0.7}
      >
        PLATFORM / LOOP
      </text>

      {/* Loop ballast */}
      <rect x={loopEntryX - 10} y={LOOP_Y - 6} width={loopExitX - loopEntryX + 20} height={12} fill="#1e293b" opacity={0.6} rx={2} />

      {/* Tracks */}
      {trackPath(mainLinePath)}
      {trackPath(mainLinePath2)}
      {trackPath(mainLinePath3)}
      {trackPath(loopLeftCurve)}
      {trackPath(loopStraight)}
      {trackPath(loopRightCurve)}

      {/* Track labels */}
      <text x={40} y={MAIN_Y - 12} fontSize={9} fill="#475569" fontFamily="sans-serif" letterSpacing={1.5}>
        MAIN LINE
      </text>

      {/* Kilometre posts */}
      {[100, 300, 500, 700, 900, 1100].map((kx) => (
        <g key={kx}>
          <line x1={kx} y1={MAIN_Y + 6} x2={kx} y2={MAIN_Y + 14} stroke="#334155" strokeWidth={1} />
        </g>
      ))}

      {/* Buffer stops / line ends */}
      <rect x={0} y={MAIN_Y - 7} width={6} height={14} fill="#ef4444" rx={1} opacity={0.7} />
      <rect x={CANVAS_W - 6} y={MAIN_Y - 7} width={6} height={14} fill="#ef4444" rx={1} opacity={0.7} />

      {/* Direction labels */}
      <text x={20} y={MAIN_Y + 28} fontSize={10} fill="#6b7280" fontFamily="sans-serif">← A</text>
      <text x={CANVAS_W - 40} y={MAIN_Y + 28} fontSize={10} fill="#6b7280" fontFamily="sans-serif">B →</text>

      {/* Points / Switches */}
      {POINTS.map((pt) => (
        <PointSwitch
          key={pt.id}
          point={pt}
          position={points[pt.id] ?? 'normal'}
        />
      ))}

      {/* Signals */}
      {SIGNALS.map((sig) => (
        <Signal
          key={sig.id}
          signal={sig}
          aspect={signals[sig.id] ?? 'red'}
          onClick={(s) => onSignalClick?.(s.id)}
        />
      ))}

      {/* Trains (clipped to canvas) */}
      <g clipPath="url(#canvasClip)">
        {TRAINS.map((def) => {
          const pos = trains.find((t) => t.id === def.id);
          if (!pos) return null;
          return <TrainCar key={def.id} def={def} pos={pos} />;
        })}
      </g>

      {/* Overlay: signal aspect legend indicators */}
      <g transform={`translate(${CANVAS_W - 140}, ${CANVAS_H - 80})`}>
        <rect x={0} y={0} width={132} height={70} rx={5} fill="#0f172a" stroke="#1e293b" strokeWidth={1} opacity={0.9} />
        {[
          { color: '#ff2020', label: 'DANGER (Stop)' },
          { color: '#ffcc00', label: 'CAUTION' },
          { color: '#00e05a', label: 'CLEAR (Proceed)' },
        ].map((item, i) => (
          <g key={i} transform={`translate(10, ${12 + i * 19})`}>
            <circle cx={6} cy={6} r={5} fill={item.color} />
            <text x={16} y={10} fontSize={8.5} fill="#94a3b8" fontFamily="sans-serif">{item.label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}
