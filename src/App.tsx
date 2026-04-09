import { useState } from 'react';
import { Brain as Train } from 'lucide-react';
import type { ScenarioDef } from './types';
import { SCENARIOS } from './data/scenarios';
import TrackCanvas from './components/TrackCanvas';
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';
import SignalLegend from './components/SignalLegend';
import { useSimulation } from './hooks/useSimulation';

export default function App() {
  const [scenario, setScenario] = useState<ScenarioDef>(SCENARIOS[0]);
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);

  const {
    state,
    play,
    pause,
    stepForward,
    stepBack,
    reset,
    setSpeed,
    totalSteps,
  } = useSimulation(scenario);

  function handleScenarioChange(sc: ScenarioDef) {
    setScenario(sc);
    setSelectedSignalId(null);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/50">
              <Train size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-none">Railway Signal Interlocking Simulator</h1>
              <p className="text-[11px] text-slate-400 mt-0.5">Station layout with main line and loop — signal aspects, points, and route logic</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs px-2 py-1 bg-slate-800 rounded font-mono text-slate-500">Educational Tool</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 py-4 flex flex-col gap-4">
        <ControlPanel
          scenario={scenario}
          onScenarioChange={handleScenarioChange}
          stepIndex={state.stepIndex}
          totalSteps={totalSteps}
          playing={state.playing}
          speed={state.speed}
          onPlay={play}
          onPause={pause}
          onStepForward={stepForward}
          onStepBack={stepBack}
          onReset={reset}
          onSpeedChange={setSpeed}
        />

        <div className="flex flex-col xl:flex-row gap-4 flex-1">
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 p-3">
              <TrackCanvas
                signals={state.signals}
                points={state.points}
                trains={state.trains}
                onSignalClick={(id) => setSelectedSignalId((prev) => (prev === id ? null : id))}
              />
            </div>
            <SignalLegend />
          </div>

          <div className="xl:w-80 2xl:w-96 flex-shrink-0">
            <InfoPanel
              step={state.currentStep}
              signals={state.signals}
              points={state.points}
              scenarioDescription={scenario.description}
              selectedSignalId={selectedSignalId}
              onCloseSignalInfo={() => setSelectedSignalId(null)}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-3 text-center text-[10px] text-slate-600">
        Railway Signal Interlocking Simulator — Educational demonstration of signal aspects, point operations, and route setting logic
      </footer>
    </div>
  );
}
