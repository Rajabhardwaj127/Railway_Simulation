import type { ScenarioDef } from '../types';
import { MAIN_Y, LOOP_Y, LEFT_SWITCH_X, RIGHT_SWITCH_X } from './trackLayout';

const OFF_LEFT = -140;
const OFF_RIGHT = 1340;
const LOOP_ENTRY_X = LEFT_SWITCH_X + 65;
const LOOP_MID_X = 600;
const LOOP_EXIT_X = RIGHT_SWITCH_X - 65;

const ALL_RED = {
  DA: 'red', HA: 'red', MSA: 'red', LSA: 'red',
  LSB: 'red', MSB: 'red', HB: 'red', DB: 'red',
} as const;

export const SCENARIOS: ScenarioDef[] = [
  // ─────────────────────────────────────────────────────────────────
  // 1. THROUGH MOVEMENT
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'through',
    name: 'Through Movement',
    shortDesc: 'Train passes straight through on the main line',
    description:
      'A train approaches from the A side and runs non-stop through the station on the main line. Both points are set to NORMAL (straight). Signals clear in sequence from the starter backwards — this is called the "route-release" or "approach-lit" sequence.',
    trainIds: ['A'],
    steps: [
      {
        title: 'Step 1 — Train Approaching',
        narration: 'Train A is detected approaching the station from the A direction.',
        detail:
          'All signals are at DANGER (red) as the default safe state. No route is yet set.',
        signals: { ...ALL_RED },
        points: { PL: 'normal', PR: 'normal' },
        trains: [
          { id: 'A', x: -60, y: MAIN_Y, visible: true, facing: 'right' },
        ],
        duration: 2000,
      },
      {
        title: 'Step 2 — Route Set: Main Line Through',
        narration: 'The signaller sets a through route. Both points are already NORMAL. Signals clear from starter backwards.',
        detail:
          'Interlocking logic checks: (a) both PL and PR are NORMAL and locked, (b) the main line section ahead is unoccupied. Only then are the signals cleared in the sequence MSA → HA → DA.',
        signals: { ...ALL_RED, MSA: 'green', HA: 'green', DA: 'yellow' },
        points: { PL: 'normal', PR: 'normal' },
        trains: [
          { id: 'A', x: -60, y: MAIN_Y, visible: true, facing: 'right' },
        ],
        duration: 2500,
      },
      {
        title: 'Step 3 — Train Enters Station Limits',
        narration: 'Train A passes DA and HA. Distant shows caution; home shows green.',
        detail:
          'DA (distant) shows YELLOW — the driver has received a caution aspect and is prepared to stop at the home. HA shows GREEN — the route is confirmed clear. The driver may continue.',
        signals: { ...ALL_RED, MSA: 'green', HA: 'green', DA: 'yellow' },
        points: { PL: 'normal', PR: 'normal' },
        trains: [
          { id: 'A', x: 130, y: MAIN_Y, visible: true, facing: 'right' },
        ],
        duration: 2000,
      },
      {
        title: 'Step 4 — Train Passes Home & Starter',
        narration: 'Train A passes HA. The track circuit ahead shows the train has entered between points.',
        detail:
          'Once Train A occupies the track circuit between PL and PR, the route is "locked in". Signals behind are automatically replaced to DANGER as each section is occupied.',
        signals: { ...ALL_RED, MSA: 'green' },
        points: { PL: 'normal', PR: 'normal' },
        trains: [
          { id: 'A', x: 420, y: MAIN_Y, visible: true, facing: 'right' },
        ],
        duration: 2000,
      },
      {
        title: 'Step 5 — Train Running Through',
        narration: 'Train A runs through the station at line speed on the main line, passing MSA.',
        detail:
          'MSA clears to RED once the train passes it. PR is confirmed NORMAL — the route from loop to main on the right side is locked out while the train is in the section.',
        signals: { ...ALL_RED },
        points: { PL: 'normal', PR: 'normal' },
        trains: [
          { id: 'A', x: 700, y: MAIN_Y, visible: true, facing: 'right' },
        ],
        duration: 2000,
      },
      {
        title: 'Step 6 — Train Clear of Station',
        narration: 'Train A has cleared the station limits. All signals return to DANGER.',
        detail:
          'Track circuits confirm the line is clear. The interlocking releases the route. Points are free to be reset. A full through movement is complete.',
        signals: { ...ALL_RED },
        points: { PL: 'normal', PR: 'normal' },
        trains: [
          { id: 'A', x: OFF_RIGHT, y: MAIN_Y, visible: false, facing: 'right' },
        ],
        duration: 2000,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 2. CROSSING
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'crossing',
    name: 'Crossing Movement',
    shortDesc: 'Two trains cross — one diverted to the loop',
    description:
      'Trains A and B approach from opposite ends simultaneously. Train A is diverted into the loop while Train B runs through on the main line. This is the classic "crossing" manoeuvre at a passing loop station.',
    trainIds: ['A', 'B'],
    steps: [
      {
        title: 'Step 1 — Both Trains Approaching',
        narration: 'Train A approaches from A, Train B from B. Conflict detected — they cannot both use the main line.',
        detail:
          'The interlocking detects occupation on both approach sections simultaneously. Both trains are held at DANGER until a crossing route is set.',
        signals: { ...ALL_RED },
        points: { PL: 'normal', PR: 'normal' },
        trains: [
          { id: 'A', x: -60, y: MAIN_Y, visible: true, facing: 'right' },
          { id: 'B', x: OFF_RIGHT, y: MAIN_Y, visible: true, facing: 'left' },
        ],
        duration: 2500,
      },
      {
        title: 'Step 2 — Route Set: A to Loop, B through Main',
        narration: 'Signaller sets PL to REVERSE (diverting A to loop) and PR to NORMAL. Loop signals clear for A; main line signals clear for B.',
        detail:
          'Interlocking rules: PL and PR must be set and locked before any signal is cleared. Conflicting routes are mutually exclusive — PL REVERSE and the main through route cannot both be set at once.',
        signals: {
          ...ALL_RED,
          DA: 'yellow', HA: 'green', LSA: 'green',
          DB: 'yellow', HB: 'green', MSB: 'green',
        },
        points: { PL: 'reverse', PR: 'normal' },
        trains: [
          { id: 'A', x: -60, y: MAIN_Y, visible: true, facing: 'right' },
          { id: 'B', x: OFF_RIGHT, y: MAIN_Y, visible: true, facing: 'left' },
        ],
        duration: 2500,
      },
      {
        title: 'Step 3 — Trains Move Simultaneously',
        narration: 'Train A approaches PL following the loop aspect. Train B approaches PR on the main line.',
        detail:
          'Both movements proceed simultaneously but on separate, interlocked paths. The loop route and main line route cannot interfere with each other.',
        signals: {
          ...ALL_RED,
          DA: 'yellow', HA: 'green', LSA: 'green',
          DB: 'yellow', HB: 'green', MSB: 'green',
        },
        points: { PL: 'reverse', PR: 'normal' },
        trains: [
          { id: 'A', x: 130, y: MAIN_Y, visible: true, facing: 'right' },
          { id: 'B', x: OFF_RIGHT - 200, y: MAIN_Y, visible: true, facing: 'left' },
        ],
        duration: 2000,
      },
      {
        title: 'Step 4 — Train A Enters Loop',
        narration: 'Train A passes PL (set REVERSE) and curves down onto the loop line.',
        detail:
          'HA showed GREEN for the loop route. PL diverts Train A onto the loop. MSA remains RED — the main line starter was never cleared for Train A.',
        signals: {
          ...ALL_RED,
          LSA: 'green',
          DB: 'yellow', HB: 'green', MSB: 'green',
        },
        points: { PL: 'reverse', PR: 'normal' },
        trains: [
          { id: 'A', x: LOOP_ENTRY_X, y: LOOP_Y, visible: true, facing: 'right' },
          { id: 'B', x: 850, y: MAIN_Y, visible: true, facing: 'left' },
        ],
        duration: 2000,
      },
      {
        title: 'Step 5 — Trains Crossing',
        narration: 'Train A is safely on the loop. Train B passes over the crossing on the main line.',
        detail:
          'Physical separation: Train A is on the loop (y = lower track) and Train B is on the main line. Interlocking ensures neither switch can be moved while both tracks are occupied.',
        signals: { ...ALL_RED, MSB: 'green' },
        points: { PL: 'reverse', PR: 'normal' },
        trains: [
          { id: 'A', x: LOOP_MID_X - 100, y: LOOP_Y, visible: true, facing: 'right' },
          { id: 'B', x: 540, y: MAIN_Y, visible: true, facing: 'left' },
        ],
        duration: 2500,
      },
      {
        title: 'Step 6 — Train B Clears, PR Set to REVERSE for Train A',
        narration: 'Train B has cleared the station. PR is now set to REVERSE to allow Train A to exit the loop onto the main line.',
        detail:
          'Track circuit confirms Train B has passed PR. The route from loop to B-side main is now set. PR set REVERSE, LSB cleared to GREEN.',
        signals: { ...ALL_RED, LSB: 'green' },
        points: { PL: 'reverse', PR: 'reverse' },
        trains: [
          { id: 'A', x: LOOP_MID_X + 100, y: LOOP_Y, visible: true, facing: 'right' },
          { id: 'B', x: 250, y: MAIN_Y, visible: true, facing: 'left' },
        ],
        duration: 2500,
      },
      {
        title: 'Step 7 — Train A Exits Loop',
        narration: 'Train A passes LSB and curves up through PR onto the main line, continuing in the B direction.',
        detail:
          'LSB was GREEN — Train A is authorised to leave the loop. PR diverts A from loop to main. The crossing manoeuvre is complete.',
        signals: { ...ALL_RED },
        points: { PL: 'normal', PR: 'normal' },
        trains: [
          { id: 'A', x: RIGHT_SWITCH_X + 100, y: MAIN_Y, visible: true, facing: 'right' },
          { id: 'B', x: OFF_LEFT + 80, y: MAIN_Y, visible: false, facing: 'left' },
        ],
        duration: 2000,
      },
      {
        title: 'Step 8 — Crossing Complete',
        narration: 'Both trains have cleared the station. All signals at DANGER. Points reset to NORMAL. Interlocking released.',
        detail:
          'Crossing movement successfully completed. Both trains operated safely on physically separated tracks thanks to signal interlocking and point control.',
        signals: { ...ALL_RED },
        points: { PL: 'normal', PR: 'normal' },
        trains: [
          { id: 'A', x: OFF_RIGHT, y: MAIN_Y, visible: false, facing: 'right' },
          { id: 'B', x: OFF_LEFT, y: MAIN_Y, visible: false, facing: 'left' },
        ],
        duration: 2000,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 3. OVERTAKING
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'overtaking',
    name: 'Overtaking Movement',
    shortDesc: 'Faster train overtakes slower train via the loop',
    description:
      'Train A (slow goods) is running ahead of Train B (fast express). Train A is diverted into the loop to allow Train B to pass and exit first. Train A then follows Train B out of the station.',
    trainIds: ['A', 'B'],
    steps: [
      {
        title: 'Step 1 — Both Trains Approaching from A',
        narration: 'Train A (slow) is ahead, Train B (fast express) is close behind. Overtaking is required.',
        detail:
          'Train B would be delayed if it follows Train A. The signaller initiates an overtaking movement: A is diverted to the loop, B is routed through on the main line.',
        signals: { ...ALL_RED },
        points: { PL: 'normal', PR: 'normal' },
        trains: [
          { id: 'A', x: -60, y: MAIN_Y, visible: true, facing: 'right' },
          { id: 'B', x: -200, y: MAIN_Y, visible: true, facing: 'right' },
        ],
        duration: 2500,
      },
      {
        title: 'Step 2 — Route Set: A to Loop',
        narration: 'PL set to REVERSE for Train A. DA and HA show caution/proceed for loop entry. Train B held at DANGER.',
        detail:
          'Only Train A\'s route (to loop) is set at this stage. Train B receives a RED aspect — it must wait. Interlocking prevents conflicting route setting.',
        signals: { ...ALL_RED, DA: 'yellow', HA: 'green', LSA: 'green' },
        points: { PL: 'reverse', PR: 'normal' },
        trains: [
          { id: 'A', x: -60, y: MAIN_Y, visible: true, facing: 'right' },
          { id: 'B', x: -200, y: MAIN_Y, visible: true, facing: 'right' },
        ],
        duration: 2500,
      },
      {
        title: 'Step 3 — Train A Enters Loop',
        narration: 'Train A passes HA and PL, entering the loop. Train B is held behind HA.',
        detail:
          'Track circuit detects Train A on the loop. PL remains locked REVERSE. Train B\'s HA and DA remain RED while Train A occupies the entry section.',
        signals: { ...ALL_RED, LSA: 'green' },
        points: { PL: 'reverse', PR: 'normal' },
        trains: [
          { id: 'A', x: LOOP_ENTRY_X, y: LOOP_Y, visible: true, facing: 'right' },
          { id: 'B', x: -60, y: MAIN_Y, visible: true, facing: 'right' },
        ],
        duration: 2000,
      },
      {
        title: 'Step 4 — Train A Clear of Points, Route Set for B',
        narration: 'Train A clear of PL. PL reset to NORMAL. Route set for Train B through on the main line.',
        detail:
          'Once Train A is beyond PL and the entry section is clear, PL is reset to NORMAL. A through route for Train B is set: DA → HA → MSA all clear.',
        signals: { ...ALL_RED, DA: 'yellow', HA: 'green', MSA: 'green', LSA: 'green' },
        points: { PL: 'normal', PR: 'normal' },
        trains: [
          { id: 'A', x: LOOP_MID_X - 150, y: LOOP_Y, visible: true, facing: 'right' },
          { id: 'B', x: -60, y: MAIN_Y, visible: true, facing: 'right' },
        ],
        duration: 2500,
      },
      {
        title: 'Step 5 — Train B Passes Through at Speed',
        narration: 'Train B runs through on the main line at full line speed, overtaking Train A waiting on the loop.',
        detail:
          'Train B sees GREEN at HA and MSA — it is authorised to proceed at line speed. Train A is safely held in the loop on a separate track.',
        signals: { ...ALL_RED, MSA: 'green' },
        points: { PL: 'normal', PR: 'normal' },
        trains: [
          { id: 'A', x: LOOP_MID_X, y: LOOP_Y, visible: true, facing: 'right' },
          { id: 'B', x: 550, y: MAIN_Y, visible: true, facing: 'right' },
        ],
        duration: 2000,
      },
      {
        title: 'Step 6 — Train B Clears, PR Set for Train A',
        narration: 'Train B has cleared PR. PR set to REVERSE. LSB cleared for Train A to exit the loop.',
        detail:
          'Track circuit confirms Train B is beyond PR. PR is now set REVERSE to allow Train A to exit. LSB cleared to GREEN. Train A can now depart the loop.',
        signals: { ...ALL_RED, LSB: 'green' },
        points: { PL: 'normal', PR: 'reverse' },
        trains: [
          { id: 'A', x: LOOP_EXIT_X, y: LOOP_Y, visible: true, facing: 'right' },
          { id: 'B', x: 1050, y: MAIN_Y, visible: true, facing: 'right' },
        ],
        duration: 2500,
      },
      {
        title: 'Step 7 — Train A Exits Loop, Overtaking Complete',
        narration: 'Train A exits the loop via PR (REVERSE) and joins the main line. Train B has departed ahead.',
        detail:
          'Train A passes LSB (GREEN), traverses PR (REVERSE) and is back on the main line. The overtaking manoeuvre is complete. Train B is safely ahead and the line is now clear.',
        signals: { ...ALL_RED },
        points: { PL: 'normal', PR: 'normal' },
        trains: [
          { id: 'A', x: RIGHT_SWITCH_X + 120, y: MAIN_Y, visible: true, facing: 'right' },
          { id: 'B', x: OFF_RIGHT, y: MAIN_Y, visible: false, facing: 'right' },
        ],
        duration: 2000,
      },
      {
        title: 'Step 8 — Overtaking Complete',
        narration: 'Both trains have cleared the station. Express (B) is ahead of goods (A). Interlocking reset to normal working.',
        detail:
          'Overtaking movement successfully completed. Signal interlocking and track circuits enabled a safe interchange of train order without any risk of collision.',
        signals: { ...ALL_RED },
        points: { PL: 'normal', PR: 'normal' },
        trains: [
          { id: 'A', x: OFF_RIGHT, y: MAIN_Y, visible: false, facing: 'right' },
          { id: 'B', x: OFF_RIGHT, y: MAIN_Y, visible: false, facing: 'right' },
        ],
        duration: 2000,
      },
    ],
  },
];
