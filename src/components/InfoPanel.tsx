import { Info, Radio, ArrowLeftRight } from 'lucide-react';
import type { SimStep, SignalAspect, PointPosition } from '../types';
import { SIGNALS } from '../data/trackLayout';

interface Props {
  step: SimStep | null;
  signals: Record<string, SignalAspect>;
  points: Record<string, PointPosition>;
  scenarioDescription: string;
  selectedSignalId: string | null;
  onCloseSignalInfo: () => void;
}

const ASPECT_STYLES: Record<SignalAspect, { dot: string; label: string; text: string }> = {
  red: { dot: 'bg-red-500', label: 'DANGER', text: 'text-red-400' },
  yellow: { dot: 'bg-yellow-400', label: 'CAUTION', text: 'text-yellow-400' },
  green: { dot: 'bg-emerald-400', label: 'CLEAR', text: 'text-emerald-400' },
  'double-yellow': { dot: 'bg-yellow-400', label: 'CAUTION', text: 'text-yellow-400' },
  off: { dot: 'bg-slate-700', label: 'OFF', text: 'text-slate-500' },
};

function AspectDot({ aspect }: { aspect: SignalAspect }) {
  const s = ASPECT_STYLES[aspect];
  return (
    <span className={`inline-block w-2.5 h-2.5 rounded-full ${s.dot} mr-1.5 shadow-sm`} />
  );
}

export default function InfoPanel({
  step,
  signals,
  points,
  scenarioDescription,
  selectedSignalId,
  onCloseSignalInfo,
}: Props) {
  const selectedSig = selectedSignalId ? SIGNALS.find((s) => s.id === selectedSignalId) : null;

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Scenario description */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Info size={14} className="text-blue-400" />
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Scenario</span>
        </div>
        <p className="text-slate-300 text-xs leading-relaxed">{scenarioDescription}</p>
      </div>

      {/* Current step */}
      {step && (
        <div className="bg-slate-900 border border-blue-800/50 rounded-xl p-4 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">{step.title}</span>
          </div>
          <p className="text-white text-sm font-medium mb-2 leading-snug">{step.narration}</p>
          <p className="text-slate-400 text-xs leading-relaxed">{step.detail}</p>
        </div>
      )}

      {/* Signal info on click */}
      {selectedSig && (
        <div className="bg-slate-900 border border-amber-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Radio size={13} className="text-amber-400" />
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Signal {selectedSig.label}
              </span>
            </div>
            <button
              onClick={onCloseSignalInfo}
              className="text-slate-500 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed mb-2">{selectedSig.description}</p>
          <div className="flex items-center gap-2">
            <AspectDot aspect={signals[selectedSig.id] ?? 'off'} />
            <span className={`text-xs font-bold ${ASPECT_STYLES[signals[selectedSig.id] ?? 'off'].text}`}>
              {ASPECT_STYLES[signals[selectedSig.id] ?? 'off'].label}
            </span>
            <span className="text-slate-500 text-xs">— {selectedSig.type} signal, facing {selectedSig.facing}</span>
          </div>
        </div>
      )}

      {/* Signal state table */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <Radio size={12} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signal Aspects</span>
          <span className="text-[10px] text-slate-600 ml-auto">Click any signal on the diagram</span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {SIGNALS.map((sig) => {
            const asp = signals[sig.id] ?? 'red';
            const s = ASPECT_STYLES[asp];
            return (
              <div
                key={sig.id}
                className="flex flex-col items-center bg-slate-800 rounded p-1.5 gap-0.5"
              >
                <span className="text-[9px] font-mono text-slate-400">{sig.label}</span>
                <div className="flex items-center gap-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${s.dot}`} />
                  <span className={`text-[8px] font-bold ${s.text}`}>{s.label.slice(0, 3)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Points state */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <ArrowLeftRight size={12} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Points Position</span>
        </div>
        <div className="flex gap-2">
          {Object.entries(points).map(([id, pos]) => (
            <div key={id} className="flex-1 flex items-center justify-between bg-slate-800 rounded px-2.5 py-1.5">
              <span className="text-xs font-mono text-slate-300 font-bold">{id}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  pos === 'normal'
                    ? 'bg-emerald-900/60 text-emerald-400'
                    : 'bg-amber-900/60 text-amber-400'
                }`}
              >
                {pos === 'normal' ? 'NORMAL' : 'REVERSE'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
