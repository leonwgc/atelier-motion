import './styles/theme.css';
import './styles/text-rotate.css';
import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes } from 'react';
import { motionDuration } from './internal/motion';

export interface TextRotateProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  words: readonly string[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  autoPlay?: boolean;
  paused?: boolean;
  pauseOnHover?: boolean;
  interval?: number;
  duration?: number;
  animation?: 'fade' | 'slide-up';
}

function normalizeIndex(index: number, length: number) {
  return length > 0 && Number.isFinite(index) ? ((Math.trunc(index) % length) + length) % length : 0;
}

export function TextRotate({ words, index, defaultIndex = 0, onIndexChange, autoPlay = true, paused = false, pauseOnHover = true, interval = 2400, duration = 300, animation = 'slide-up', className = '', style, onMouseEnter, onMouseLeave, onFocus, onBlur, ...props }: TextRotateProps) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const current = normalizeIndex(index ?? internalIndex, words.length);
  const controlled = index !== undefined;
  const onIndexChangeRef = useRef(onIndexChange);
  onIndexChangeRef.current = onIndexChange;

  useEffect(() => {
    if (controlled || !autoPlay || paused || focused || (pauseOnHover && hovered) || words.length < 2) return;
    const timer = window.setTimeout(() => {
      const next = (current + 1) % words.length;
      setInternalIndex(next);
      onIndexChangeRef.current?.(next);
    }, Math.max(100, motionDuration(interval, 2400)));
    return () => window.clearTimeout(timer);
  }, [autoPlay, controlled, current, focused, hovered, interval, pauseOnHover, paused, words.length]);

  const rotateStyle = { ...style, '--at-text-rotate-duration': `${motionDuration(duration, 300)}ms` } as CSSProperties;
  return <span {...props} className={`at-text-rotate at-text-rotate--${animation} ${className}`} style={rotateStyle} aria-live={props['aria-live'] ?? 'off'}
    onMouseEnter={(event) => { setHovered(true); onMouseEnter?.(event); }}
    onMouseLeave={(event) => { setHovered(false); onMouseLeave?.(event); }}
    onFocus={(event) => { setFocused(true); onFocus?.(event); }}
    onBlur={(event) => { setFocused(false); onBlur?.(event); }}
  >
    <span key={`${current}:${words[current] ?? ''}`} className="at-text-rotate__word">{words[current] ?? ''}</span>
  </span>;
}
