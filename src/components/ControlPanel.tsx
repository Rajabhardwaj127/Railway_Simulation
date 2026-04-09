import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Gauge } from 'lucide-react';
import type { ScenarioDef } from '../types';
import { SCENARIOS } from '../data/scenarios';

interface Props {
  scenario: ScenarioDef;
  onScenarioChange: (s: ScenarioDef) => void;
  stepIndex: number;
  totalSteps: number;
  playing: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
  onSpeedChange: (s: number) => void;
}

const SPEEDS = [0.5, 1, 1.5, 2];

export default function ControlPanel({
  scenario,
  onScenarioChange,
  stepIndex,
  totalSteps,
  playing,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBack,
  onReset,
  onSpeedChange,
}: Props) {
  const atEnd = stepIndex >= totalSteps - 1;

  return (
    <div className="flex flex-col gap-3">
      {/* Scenario tabs */}
      <div className="flex gap-1 p-1 bg-slate-900 rounded-xl border border-slate-700">
        {SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            onClick={() => onScenarioChange(sc)}
            className={`
              flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all duration-200
              ${scenario.id === sc.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }
            `}
          >
            <div className="font-bold truncate">{sc.name}</div>
            <div className="text-[10px] opacity-75 hidden sm:block truncate">{sc.shortDesc}</div>
          </button>
        ))}
      </div>

      {/* Playback controls row */}
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-3">
        {/* Reset */}
        <button
          onClick={onReset}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Reset"
        >
          <RotateCcw size={16} />
        </button>

        {/* Step back */}
        <button
          onClick={onStepBack}
          disabled={stepIndex === 0}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Previous step"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Play/Pause */}
        <button
          onClick={playing ? onPause : onPlay}
          disabled={atEnd}
          className={`
            flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200
            ${atEnd
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
              : playing
              ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-900/40'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40'
            }
          `}
        >
          {playing ? <Pause size={15} /> : <Play size={15} />}
          {playing ? 'Pause' : 'Play'}
        </button>

        {/* Step forward */}
        <button
          onClick={onStepForward}
          disabled={atEnd}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Next step"
        >
          <ChevronRight size={16} />
        </button>

        {/* Step progress */}
        <div className="flex-1 flex items-center gap-2 ml-2">
          <div className="flex-1 bg-slate-800 rounded-full h-2 relative overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>
          <span className="text-xs text-slate-400 font-mono w-12 text-right">
            {stepIndex + 1} / {totalSteps}
          </span>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-1.5 ml-1 pl-3 border-l border-slate-700">
          <Gauge size={13} className="text-slate-500" />
          <div className="flex gap-1">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`
                  w-8 h-6 rounded text-[10px] font-bold transition-all
                  ${speed === s
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }
                `}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
