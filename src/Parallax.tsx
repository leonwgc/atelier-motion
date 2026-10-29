import './styles/theme.css';
import './styles/parallax.css';
import { useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode, type RefObject } from 'react';
import { useReducedMotion } from './internal/motion';

export interface ParallaxProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  distance?: number;
  containerRef?: RefObject<HTMLElement>;
  disabled?: boolean;
}

export function Parallax({ children, distance = 48, containerRef, disabled = false, className = '', style, ...props }: ParallaxProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    if (!root || !inner) return;
    if (disabled || reducedMotion) { inner.style.transform = ''; return; }
    const container = containerRef?.current;
    const target = container ?? window;
    const range = Number.isFinite(distance) ? Math.min(160, Math.max(0, distance)) : 48;
    let frame = 0;
    const read = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const viewport = container?.getBoundingClientRect();
      const top = viewport?.top ?? 0;
      const height = viewport?.height ?? window.innerHeight;
      const center = top + height / 2;
      const offset = Math.max(-1, Math.min(1, (center - (rect.top + rect.height / 2)) / ((height + rect.height) / 2)));
      inner.style.transform = `translate3d(0, ${Math.round(offset * range * 100) / 100}px, 0)`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(read); };
    read();
    target.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule);
    observer?.observe(root);
    if (container) observer?.observe(container);
    return () => { target.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); observer?.disconnect(); cancelAnimationFrame(frame); inner.style.transform = ''; };
  }, [containerRef, disabled, distance, reducedMotion]);
  return <div {...props} ref={rootRef} className={`at-parallax ${className}`} style={style as CSSProperties}><div ref={innerRef} className="at-parallax__inner">{children}</div></div>;
}
