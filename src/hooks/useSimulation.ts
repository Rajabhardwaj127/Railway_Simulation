import { useState, useEffect, useRef, useCallback } from 'react';
import type { SimStep, ScenarioDef, TrainPosition, SignalAspect, PointPosition } from '../types';
import { MAIN_Y, LOOP_Y, LEFT_SWITCH_X, RIGHT_SWITCH_X } from '../data/trackLayout';

interface SimState {
  stepIndex: number;
  playing: boolean;
  speed: number;
  signals: Record<string, SignalAspect>;
  points: Record<string, PointPosition>;
  trains: TrainPosition[];
  currentStep: SimStep | null;
}

function interpolateTrains(
  from: TrainPosition[],
  to: TrainPosition[],
  t: number
): TrainPosition[] {
  return to.map((target) => {
    const src = from.find((f) => f.id === target.id);
    if (!src) return target;
    return {
      ...target,
      x: src.x + (target.x - src.x) * t,
      y: src.y + (target.y - src.y) * t,
      visible: t > 0.5 ? target.visible : src.visible,
    };
  });
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export function useSimulation(scenario: ScenarioDef) {
  const [state, setState] = useState<SimState>(() => buildInitialState(scenario));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
  const animStateRef = useRef<{
    fromTrains: TrainPosition[];
    toTrains: TrainPosition[];
    startTime: number;
    duration: number;
  } | null>(null);

  function buildInitialState(sc: ScenarioDef): SimState {
    const step = sc.steps[0];
    return {
      stepIndex: 0,
      playing: false,
      speed: 1,
      signals: { ...step.signals } as Record<string, SignalAspect>,
      points: { ...step.points } as Record<string, PointPosition>,
      trains: step.trains.map((t) => ({ ...t })),
      currentStep: step,
    };
  }

  function applyStep(sc: ScenarioDef, idx: number, prevTrains: TrainPosition[]) {
    const step = sc.steps[idx];
    if (!step) return;

    const animDuration = 1200;

    animStateRef.current = {
      fromTrains: prevTrains.map((t) => ({ ...t })),
      toTrains: step.trains.map((t) => ({ ...t })),
      startTime: performance.now(),
      duration: animDuration,
    };

    setState((prev) => ({
      ...prev,
      stepIndex: idx,
      signals: { ...step.signals } as Record<string, SignalAspect>,
      points: { ...step.points } as Record<string, PointPosition>,
      currentStep: step,
    }));

    if (animRef.current) cancelAnimationFrame(animRef.current);
    const animate = (now: number) => {
      const anim = animStateRef.current;
      if (!anim) return;
      const elapsed = now - anim.startTime;
      const raw = elapsed / anim.duration;
      const t = clamp(raw, 0, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      setState((prev) => ({
        ...prev,
        trains: interpolateTrains(anim.fromTrains, anim.toTrains, ease),
      }));

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setState((prev) => ({
          ...prev,
          trains: anim.toTrains.map((tt) => ({ ...tt })),
        }));
        animStateRef.current = null;
      }
    };
    animRef.current = requestAnimationFrame(animate);
  }

  const scheduleAutoAdvance = useCallback(
    (sc: ScenarioDef, idx: number, speed: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const step = sc.steps[idx];
      if (!step) return;
      const delay = step.duration / speed;
      timerRef.current = setTimeout(() => {
        setState((prev) => {
          const next = prev.stepIndex + 1;
          if (next >= sc.steps.length) {
            return { ...prev, playing: false };
          }
          applyStep(sc, next, prev.trains);
          scheduleAutoAdvance(sc, next, prev.speed);
          return prev;
        });
      }, delay);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animStateRef.current = null;
    setState(buildInitialState(scenario));
  }, [scenario]);

  const play = useCallback(() => {
    setState((prev) => {
      if (prev.stepIndex >= scenario.steps.length - 1) {
        return prev;
      }
      scheduleAutoAdvance(scenario, prev.stepIndex, prev.speed);
      return { ...prev, playing: true };
    });
  }, [scenario, scheduleAutoAdvance]);

  const pause = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState((prev) => ({ ...prev, playing: false }));
  }, []);

  const stepForward = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState((prev) => {
      const next = prev.stepIndex + 1;
      if (next >= scenario.steps.length) return { ...prev, playing: false };
      applyStep(scenario, next, prev.trains);
      return { ...prev, playing: false };
    });
  }, [scenario]);

  const stepBack = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState((prev) => {
      const back = prev.stepIndex - 1;
      if (back < 0) return prev;
      applyStep(scenario, back, prev.trains);
      return { ...prev, playing: false };
    });
  }, [scenario]);

  const setSpeed = useCallback((s: number) => {
    setState((prev) => ({ ...prev, speed: s }));
  }, []);

  useEffect(() => {
    reset();
  }, [scenario.id]);

  return {
    state,
    play,
    pause,
    stepForward,
    stepBack,
    reset,
    setSpeed,
    totalSteps: scenario.steps.length,
  };
}
