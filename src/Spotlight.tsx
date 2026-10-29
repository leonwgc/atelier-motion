import './styles/theme.css';
import './styles/spotlight.css';
import { useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { useReducedMotion } from './internal/motion';

export interface SpotlightProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  color?: string;
  radius?: number;
  disabled?: boolean;
}

export function Spotlight({ children, color = 'rgb(104 92 246 / 18%)', radius = 180, disabled = false, className = '', style, onPointerMove, onPointerLeave, ...props }: SpotlightProps) {
  const element = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  return <div {...props} ref={element} data-disabled={disabled || reducedMotion ? 'true' : undefined} className={`at-spotlight ${className}`} style={{ ...style, '--at-spotlight-color': color, '--at-spotlight-radius': `${Math.max(0, radius)}px` } as CSSProperties}
    onPointerMove={(event) => {
      onPointerMove?.(event);
      if (disabled || reducedMotion || event.pointerType === 'touch' || event.defaultPrevented) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => { element.current?.style.setProperty('--at-spotlight-x', `${x}px`); element.current?.style.setProperty('--at-spotlight-y', `${y}px`); });
    }}
    onPointerLeave={(event) => { onPointerLeave?.(event); cancelAnimationFrame(frame.current); element.current?.style.removeProperty('--at-spotlight-x'); element.current?.style.removeProperty('--at-spotlight-y'); }}>
    {children}
  </div>;
}
