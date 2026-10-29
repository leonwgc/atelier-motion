import './styles/theme.css';
import './styles/scroll-progress.css';
import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type RefObject } from 'react';
import { useReducedMotion } from './internal/motion';

export interface ScrollProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  containerRef?: RefObject<HTMLElement>;
  position?: 'top' | 'bottom';
  color?: string;
  height?: number;
}

export function ScrollProgress({ containerRef, position = 'top', color = 'var(--at-color-primary)', height = 3, className = '', style, ...props }: ScrollProgressProps) {
  const [progress, setProgress] = useState(0);
  const frame = useRef(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const container = containerRef?.current;
    const target = container ?? window;
    const read = () => {
      const offset = container ? container.scrollTop : window.scrollY;
      const maximum = container ? container.scrollHeight - container.clientHeight : document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maximum > 0 ? Math.min(1, Math.max(0, offset / maximum)) : 0);
    };
    const schedule = () => { if (!frame.current) frame.current = requestAnimationFrame(() => { frame.current = 0; read(); }); };
    read();
    target.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule);
    observer?.observe(container ?? document.documentElement);
    return () => { target.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); observer?.disconnect(); cancelAnimationFrame(frame.current); };
  }, [containerRef]);
  return <div {...props} role="progressbar" aria-label={props['aria-label'] ?? 'Scroll progress'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} className={`at-scroll-progress at-scroll-progress--${position} ${className}`} style={{ ...style, '--at-scroll-progress-color': color, '--at-scroll-progress-height': `${Math.max(1, height)}px`, '--at-scroll-progress-scale': progress, '--at-scroll-progress-transition': reducedMotion ? 'none' : undefined } as CSSProperties}><span className="at-scroll-progress__bar" /></div>;
}
