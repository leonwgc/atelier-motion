import './styles/theme.css';
import './styles/gradient-text.css';
import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { motionDuration } from './internal/motion';

export interface GradientTextProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  colors?: readonly [string, string, ...string[]];
  duration?: number;
  animate?: boolean;
}

export function GradientText({ children, colors = ['#685cf6', '#e06cae', '#685cf6'], duration = 4000, animate = true, className = '', style, ...props }: GradientTextProps) {
  const palette = colors.length >= 2 ? colors : ['#685cf6', '#e06cae'];
  return <span {...props} className={`at-gradient-text ${animate ? 'at-gradient-text--animated' : ''} ${className}`} style={{ ...style, '--at-gradient-text-background': `linear-gradient(90deg, ${palette.join(', ')})`, '--at-gradient-text-duration': `${motionDuration(duration, 4000)}ms` } as CSSProperties}>{children}</span>;
}
