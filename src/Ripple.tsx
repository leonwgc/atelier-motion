import './styles/theme.css';
import './styles/ripple.css';
import { cloneElement, useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { motionDuration, useReducedMotion } from './internal/motion';

interface RippleTargetProps extends HTMLAttributes<HTMLElement> {
  disabled?: boolean;
  children?: ReactNode;
}

export interface RippleProps {
  children: ReactElement<RippleTargetProps>;
  duration?: number;
  color?: string;
  disabled?: boolean;
}

interface Wave { id: number; x: number; y: number; size: number }

/** Decorates one native button or anchor without introducing another interactive element. */
export function Ripple({ children, duration = 550, color = 'currentColor', disabled = false }: RippleProps) {
  const [waves, setWaves] = useState<Wave[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, number>());
  const reducedMotion = useReducedMotion();
  const milliseconds = motionDuration(duration, 550);

  useEffect(() => () => { for (const timer of timers.current.values()) window.clearTimeout(timer); }, []);

  if ((children.type !== 'button' && children.type !== 'a') || children.props.dangerouslySetInnerHTML) {
    throw new Error('Ripple expects one native <button> or <a> child with regular children content.');
  }

  const removeWave = (id: number) => {
    window.clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setWaves((current) => current.filter((wave) => wave.id !== id));
  };
  const addWave = (node: HTMLElement, clientX?: number, clientY?: number) => {
    if (disabled || children.props.disabled || children.props['aria-disabled'] === true || children.props['aria-disabled'] === 'true' || reducedMotion || milliseconds === 0) return;
    const rect = node.getBoundingClientRect();
    const width = node.offsetWidth;
    const height = node.offsetHeight;
    const x = clientX === undefined ? width / 2 : (clientX - rect.left) * width / (rect.width || 1);
    const y = clientY === undefined ? height / 2 : (clientY - rect.top) * height / (rect.height || 1);
    const size = Math.hypot(Math.max(x, width - x), Math.max(y, height - y)) * 2;
    const id = nextId.current++;
    setWaves((current) => [...current, { id, x, y, size }]);
    timers.current.set(id, window.setTimeout(() => removeWave(id), milliseconds));
  };

  return cloneElement(children, {
    className: `at-ripple ${children.props.className ?? ''}`,
    onPointerDown: (event) => {
      children.props.onPointerDown?.(event);
      if (!event.defaultPrevented && event.button === 0) addWave(event.currentTarget, event.clientX, event.clientY);
    },
    onClick: (event) => {
      children.props.onClick?.(event);
      if (!event.defaultPrevented && event.detail === 0) addWave(event.currentTarget);
    },
    children: <>{children.props.children}<span className="at-ripple__layer" aria-hidden="true">
      {waves.map((wave) => <span key={wave.id} className="at-ripple__wave" style={{
        left: wave.x, top: wave.y, width: wave.size, height: wave.size,
        '--at-ripple-color': color, '--at-ripple-duration': `${milliseconds}ms`,
      } as CSSProperties} onAnimationEnd={() => removeWave(wave.id)} />)}
    </span></>,
  });
}
