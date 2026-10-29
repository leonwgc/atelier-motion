import './styles/theme.css';
import './styles/tilt.css';
import { useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { useReducedMotion } from './internal/motion';

export interface TiltProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  maxAngle?: number;
  perspective?: number;
  disabled?: boolean;
}

export function Tilt({ children, maxAngle = 8, perspective = 800, disabled = false, className = '', style, onPointerMove, onPointerLeave, ...props }: TiltProps) {
  const inner = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const reset = () => { cancelAnimationFrame(frame.current); if (inner.current) inner.current.style.transform = ''; };
  useEffect(() => { if (disabled || reducedMotion) reset(); }, [disabled, reducedMotion]);
  return <div {...props} className={`at-tilt ${className}`} style={{ ...style, '--at-tilt-perspective': `${Math.max(1, perspective)}px` } as CSSProperties}
    onPointerMove={(event) => {
      onPointerMove?.(event);
      if (disabled || reducedMotion || event.pointerType === 'touch' || event.defaultPrevented) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      const angle = Math.max(0, Math.min(30, maxAngle));
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => { if (inner.current) inner.current.style.transform = `rotateX(${-y * angle * 2}deg) rotateY(${x * angle * 2}deg)`; });
    }}
    onPointerLeave={(event) => { onPointerLeave?.(event); reset(); }}>
    <div ref={inner} className="at-tilt__inner">{children}</div>
  </div>;
}
