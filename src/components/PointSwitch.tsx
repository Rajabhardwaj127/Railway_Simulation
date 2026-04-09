import type { PointDef } from '../types';
import type { PointPosition } from '../types';
import { MAIN_Y, LOOP_Y, LEFT_SWITCH_X, RIGHT_SWITCH_X } from '../data/trackLayout';

interface Props {
  point: PointDef;
  position: PointPosition;
  onClick?: (pt: PointDef) => void;
}

export default function PointSwitch({ point, position, onClick }: Props) {
  const isLeft = point.id === 'PL';
  const isReverse = position === 'reverse';

  const mx = point.x;
  const my = MAIN_Y;

  const normalColor = '#6ee7b7';
  const reverseColor = '#fbbf24';

  if (isLeft) {
    // Left switch: main goes right, diverge goes right+down to loop
    const divergeEndX = LEFT_SWITCH_X + 65;
    const divergeEndY = LOOP_Y;
    const ctrlX = LEFT_SWITCH_X + 30;
    const ctrlY1 = MAIN_Y;
    const ctrlY2 = LOOP_Y;

    return (
      <g onClick={() => onClick?.(point)} className="cursor-pointer">
        {/* Straight route (main) */}
        <line
          x1={mx - 30} y1={my}
          x2={mx + 30} y2={my}
          stroke={isReverse ? '#334155' : normalColor}
          strokeWidth={isReverse ? 3 : 5}
          strokeLinecap="round"
          opacity={isReverse ? 0.4 : 1}
        />
        {/* Diverge route (loop) */}
        <path
          d={`M${mx},${my} C${ctrlX},${ctrlY1} ${ctrlX},${ctrlY2} ${divergeEndX},${divergeEndY}`}
          fill="none"
          stroke={isReverse ? reverseColor : '#334155'}
          strokeWidth={isReverse ? 5 : 3}
          strokeLinecap="round"
          opacity={isReverse ? 1 : 0.4}
        />
        {/* Switch blade indicator */}
        <circle cx={mx} cy={my} r={5} fill={isReverse ? reverseColor : normalColor} />
        {/* Label */}
        <text
          x={mx}
          y={my - 10}
          textAnchor="middle"
          fontSize={8.5}
          fontFamily="monospace"
          fill="#94a3b8"
          fontWeight="bold"
        >
          {point.label}
        </text>
        <text
          x={mx}
          y={my - 20}
          textAnchor="middle"
          fontSize={8}
          fontFamily="monospace"
          fill={isReverse ? reverseColor : normalColor}
        >
          {isReverse ? 'REV' : 'NML'}
        </text>
      </g>
    );
  } else {
    // Right switch: from loop converges into main line
    const divergeStartX = RIGHT_SWITCH_X - 65;
    const divergeStartY = LOOP_Y;
    const ctrlX = RIGHT_SWITCH_X - 30;
    const ctrlY1 = LOOP_Y;
    const ctrlY2 = MAIN_Y;

    return (
      <g onClick={() => onClick?.(point)} className="cursor-pointer">
        {/* Straight route (main) */}
        <line
          x1={mx - 30} y1={my}
          x2={mx + 30} y2={my}
          stroke={isReverse ? '#334155' : normalColor}
          strokeWidth={isReverse ? 3 : 5}
          strokeLinecap="round"
          opacity={isReverse ? 0.4 : 1}
        />
        {/* Converge route (from loop) */}
        <path
          d={`M${divergeStartX},${divergeStartY} C${ctrlX},${ctrlY1} ${ctrlX},${ctrlY2} ${mx},${my}`}
          fill="none"
          stroke={isReverse ? reverseColor : '#334155'}
          strokeWidth={isReverse ? 5 : 3}
          strokeLinecap="round"
          opacity={isReverse ? 1 : 0.4}
        />
        {/* Switch blade indicator */}
        <circle cx={mx} cy={my} r={5} fill={isReverse ? reverseColor : normalColor} />
        {/* Label */}
        <text
          x={mx}
          y={my - 10}
          textAnchor="middle"
          fontSize={8.5}
          fontFamily="monospace"
          fill="#94a3b8"
          fontWeight="bold"
        >
          {point.label}
        </text>
        <text
          x={mx}
          y={my - 20}
          textAnchor="middle"
          fontSize={8}
          fontFamily="monospace"
          fill={isReverse ? reverseColor : normalColor}
        >
          {isReverse ? 'REV' : 'NML'}
        </text>
      </g>
    );
  }
}
