export type SignalAspect = 'red' | 'yellow' | 'green' | 'double-yellow' | 'off';
export type PointPosition = 'normal' | 'reverse';
export type ScenarioId = 'through' | 'crossing' | 'overtaking';

export interface SignalDef {
  id: string;
  x: number;
  y: number;
  facing: 'right' | 'left';
  type: 'distant' | 'home' | 'starter' | 'loop';
  label: string;
  description: string;
}

export interface PointDef {
  id: string;
  x: number;
  y: number;
  label: string;
}

export interface TrainDef {
  id: string;
  label: string;
  color: string;
  cabColor: string;
}

export interface TrainPosition {
  id: string;
  x: number;
  y: number;
  visible: boolean;
  facing: 'right' | 'left';
}

export interface SimStep {
  title: string;
  narration: string;
  detail: string;
  signals: Record<string, SignalAspect>;
  points: Record<string, PointPosition>;
  trains: TrainPosition[];
  duration: number;
}

export interface ScenarioDef {
  id: ScenarioId;
  name: string;
  shortDesc: string;
  description: string;
  trainIds: string[];
  steps: SimStep[];
}
