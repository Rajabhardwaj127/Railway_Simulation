import type { SignalDef, PointDef, TrainDef } from '../types';

export const MAIN_Y = 175;
export const LOOP_Y = 305;
export const LEFT_SWITCH_X = 275;
export const RIGHT_SWITCH_X = 925;
export const CANVAS_W = 1200;
export const CANVAS_H = 460;

export const SIGNALS: SignalDef[] = [
  {
    id: 'DA',
    x: 70,
    y: MAIN_Y,
    facing: 'right',
    type: 'distant',
    label: 'DA',
    description: 'Distant signal (A side) — gives advance warning of the home signal aspect ahead.',
  },
  {
    id: 'HA',
    x: 200,
    y: MAIN_Y,
    facing: 'right',
    type: 'home',
    label: 'HA',
    description: 'Home signal (A side) — protects the station limits and controls entry past the left-hand points.',
  },
  {
    id: 'MSA',
    x: 348,
    y: MAIN_Y,
    facing: 'right',
    type: 'starter',
    label: 'MSA',
    description: 'Main starter (A side) — permits a train to proceed on the main line clear of the left-hand points.',
  },
  {
    id: 'LSA',
    x: 375,
    y: LOOP_Y,
    facing: 'right',
    type: 'loop',
    label: 'LSA',
    description: 'Loop starter (A side) — authorises a train inside the loop to depart in the up direction.',
  },
  {
    id: 'LSB',
    x: 825,
    y: LOOP_Y,
    facing: 'left',
    type: 'loop',
    label: 'LSB',
    description: 'Loop starter (B side) — authorises a train inside the loop to depart in the down direction.',
  },
  {
    id: 'MSB',
    x: 852,
    y: MAIN_Y,
    facing: 'left',
    type: 'starter',
    label: 'MSB',
    description: 'Main starter (B side) — permits a train to proceed on the main line clear of the right-hand points.',
  },
  {
    id: 'HB',
    x: 1000,
    y: MAIN_Y,
    facing: 'left',
    type: 'home',
    label: 'HB',
    description: 'Home signal (B side) — protects the station limits and controls entry past the right-hand points.',
  },
  {
    id: 'DB',
    x: 1130,
    y: MAIN_Y,
    facing: 'left',
    type: 'distant',
    label: 'DB',
    description: 'Distant signal (B side) — gives advance warning of the home signal aspect to trains approaching from B.',
  },
];

export const POINTS: PointDef[] = [
  {
    id: 'PL',
    x: LEFT_SWITCH_X,
    y: MAIN_Y,
    label: 'PL',
  },
  {
    id: 'PR',
    x: RIGHT_SWITCH_X,
    y: MAIN_Y,
    label: 'PR',
  },
];

export const TRAINS: TrainDef[] = [
  { id: 'A', label: 'Train A', color: '#1e88e5', cabColor: '#0d47a1' },
  { id: 'B', label: 'Train B', color: '#e53935', cabColor: '#b71c1c' },
];

export const LOOP_CURVE_LEFT_CP1 = { x: LEFT_SWITCH_X + 20, y: MAIN_Y };
export const LOOP_CURVE_LEFT_CP2 = { x: LEFT_SWITCH_X + 60, y: LOOP_Y };
export const LOOP_CURVE_LEFT_END = { x: LEFT_SWITCH_X + 65, y: LOOP_Y };

export const LOOP_CURVE_RIGHT_START = { x: RIGHT_SWITCH_X - 65, y: LOOP_Y };
export const LOOP_CURVE_RIGHT_CP1 = { x: RIGHT_SWITCH_X - 60, y: LOOP_Y };
export const LOOP_CURVE_RIGHT_CP2 = { x: RIGHT_SWITCH_X - 20, y: MAIN_Y };
