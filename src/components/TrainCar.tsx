import type { TrainDef, TrainPosition } from '../types';

interface Props {
  def: TrainDef;
  pos: TrainPosition;
}

const TRAIN_W = 100;
const TRAIN_H = 20;
const CAB_W = 18;

export default function TrainCar({ def, pos }: Props) {
  if (!pos.visible) return null;

  const { x, y } = pos;
  const facing = pos.facing ?? 'right';
  const rx = x - TRAIN_W / 2;
  const ry = y - TRAIN_H / 2;

  const cabX = facing === 'right' ? rx + TRAIN_W - CAB_W : rx;

  return (
    <g style={{ transition: 'transform 1.2s cubic-bezier(0.4,0,0.2,1)' }}>
      {/* Glow */}
      <rect
        x={rx - 2}
        y={ry - 2}
        width={TRAIN_W + 4}
        height={TRAIN_H + 4}
        rx={5}
        fill="none"
        stroke={def.color}
        strokeWidth={1}
        opacity={0.3}
      />
      {/* Body */}
      <rect
        x={rx}
        y={ry}
        width={TRAIN_W}
        height={TRAIN_H}
        rx={4}
        fill={def.color}
        opacity={0.92}
      />
      {/* Windows strip */}
      <rect
        x={rx + (facing === 'right' ? 4 : CAB_W + 2)}
        y={ry + 4}
        width={TRAIN_W - CAB_W - 8}
        height={TRAIN_H - 8}
        rx={2}
        fill="#bfdbfe"
        opacity={0.35}
      />
      {/* Cab */}
      <rect
        x={cabX}
        y={ry}
        width={CAB_W}
        height={TRAIN_H}
        rx={facing === 'right' ? '0 4 4 0' : '4 0 0 4'}
        fill={def.cabColor}
      />
      {/* Headlight */}
      <circle
        cx={facing === 'right' ? rx + TRAIN_W - 4 : rx + 4}
        cy={ry + TRAIN_H / 2}
        r={3}
        fill="#fef08a"
        opacity={0.9}
      />
      {/* Wheels */}
      {[14, 38, 62, 86].map((wx) => (
        <rect
          key={wx}
          x={rx + wx - 5}
          y={ry + TRAIN_H - 3}
          width={10}
          height={5}
          rx={2}
          fill="#1e293b"
        />
      ))}
      {/* Label */}
      <text
        x={rx + TRAIN_W / 2}
        y={ry - 5}
        textAnchor="middle"
        fontSize={9}
        fontFamily="sans-serif"
        fontWeight="bold"
        fill={def.color}
      >
        {def.label}
      </text>
    </g>
  );
}
