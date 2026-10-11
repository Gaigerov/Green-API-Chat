import { useEffect, useRef } from 'react';

export function usePolling(
  callback: () => Promise<void>,
  intervalMs: number,
  enabled = true
) {
  const callbackRef = useRef(callback);
  const activeRef = useRef(false);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let failCount = 0;

    const run = async () => {
      if (cancelled || activeRef.current) return;
      activeRef.current = true;
      try {
        await callbackRef.current();
        failCount = 0;
      } catch {
        failCount++;
      } finally {
        activeRef.current = false;
      }
      if (!cancelled) {
        const delay = failCount > 0
          ? Math.min(intervalMs * Math.pow(2, failCount - 1), 30000)
          : intervalMs;
        timer = setTimeout(run, delay);
      }
    };

    let timer = setTimeout(run, intervalMs);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [enabled, intervalMs]);
}
