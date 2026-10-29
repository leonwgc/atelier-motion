import { useEffect, useLayoutEffect, useSyncExternalStore } from 'react';

export const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function motionDuration(value: number, fallback: number) {
  return Number.isFinite(value) ? Math.max(0, value) : fallback;
}

function subscribeReducedMotion(onChange: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {};
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

function getReducedMotion() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
}
