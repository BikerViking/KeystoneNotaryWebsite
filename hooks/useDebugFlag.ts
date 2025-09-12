import { useEffect, useState } from 'react';

declare global {
  interface Window {
    __DEBUG_OVERLAY__?: boolean;
  }
}

export const useDebugFlag = (): boolean => {
  const getInitial = () => {
    if (typeof window === 'undefined') return false;
    if (typeof window.__DEBUG_OVERLAY__ === 'boolean') return window.__DEBUG_OVERLAY__;
    const q = new URLSearchParams(window.location.search);
    const v = q.get('debug') === '1';
    window.__DEBUG_OVERLAY__ = v;
    return v;
  };

  const [debug, setDebug] = useState<boolean>(getInitial);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'd') {
        window.__DEBUG_OVERLAY__ = !window.__DEBUG_OVERLAY__;
        setDebug(window.__DEBUG_OVERLAY__);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return debug;
};

