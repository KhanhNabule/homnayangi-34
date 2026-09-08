'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_COUNTER_API_URL || '';

export function useGlobalSpinCount() {
  const [count, setCount] = useState<number | null>(null);
  const alive = useRef(true);
  const accept = useCallback((data: { count?: unknown }) => {
    if (alive.current && typeof data.count === 'number' && Number.isSafeInteger(data.count) && data.count >= 0) {
      const value = data.count;
      setCount(previous => Math.max(previous ?? 0, value));
    }
  }, []);
  useEffect(() => {
    alive.current = true;
    if (!apiUrl) return () => { alive.current = false; };
    const refresh = async () => {
      if (document.hidden) return;
      try {
        const response = await fetch(apiUrl, { cache: 'no-store', signal: AbortSignal.timeout(4000) });
        if (response.ok) accept(await response.json());
      } catch { /* A counter outage must not interrupt opening a case. */ }
    };
    void refresh();
    const interval = setInterval(() => void refresh(), 30000);
    document.addEventListener('visibilitychange', refresh);
    return () => { alive.current = false; clearInterval(interval); document.removeEventListener('visibilitychange', refresh); };
  }, [accept]);

  const recordSpin = useCallback(async (id: string) => {
    if (!apiUrl) return;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }), keepalive: true, signal: AbortSignal.timeout(4000),
        });
        if (response.ok) { accept(await response.json()); return; }
        if (response.status < 500 && response.status !== 429) return;
      } catch { /* Retry the same ID: the server counts it only once. */ }
      if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }, [accept]);
  return { count, enabled: Boolean(apiUrl), recordSpin };
}
