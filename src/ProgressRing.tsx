import './styles/theme.css';
import './styles/progress-ring.css';
import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { motionDuration, useReducedMotion } from './internal/motion';

export interface ProgressRingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  duration?: number;
  children?: ReactNode;
}

export function ProgressRing({ value, size = 96, strokeWidth = 8, color = 'var(--at-color-primary)', trackColor = 'var(--at-color-border)', duration = 450, children, className = '', style, ...props }: ProgressRingProps) {
  const reducedMotion = useReducedMotion();
  const diameter = Number.isFinite(size) ? Math.max(16, size) : 96;
  const stroke = Number.isFinite(strokeWidth) ? Math.min(diameter / 2, Math.max(1, strokeWidth)) : 8;
  const progress = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
  const radius = (diameter - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return <div {...props} className={`at-progress-ring ${className}`} role="progressbar" aria-label={props['aria-label'] ?? 'Progress'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} style={{ ...style, width: diameter, height: diameter, '--at-progress-ring-duration': `${reducedMotion ? 0 : motionDuration(duration, 450)}ms` } as CSSProperties}>
    <svg className="at-progress-ring__svg" viewBox={`0 0 ${diameter} ${diameter}`} aria-hidden="true">
      <circle cx={diameter / 2} cy={diameter / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={stroke} />
      <circle className="at-progress-ring__value" cx={diameter / 2} cy={diameter / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress / 100)} />
    </svg>
    <span className="at-progress-ring__label" aria-hidden="true">{children ?? `${Math.round(progress)}%`}</span>
  </div>;
}
