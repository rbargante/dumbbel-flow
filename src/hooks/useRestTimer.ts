import { useState, useEffect, useCallback, useRef } from 'react';

export function useRestTimer(soundEnabled: boolean) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const start = useCallback((seconds: number) => {
    stop();
    setSecondsLeft(seconds);
    setIsRunning(true);
  }, [stop]);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          // beep
          if (soundEnabled) {
            try {
              const ctx = new AudioContext();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.value = 880;
              gain.gain.value = 0.3;
              osc.start();
              osc.stop(ctx.currentTime + 0.15);
            } catch {}
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, soundEnabled]);

  return { secondsLeft, isRunning, start, stop };
}
