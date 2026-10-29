import './styles/theme.css';
import './styles/image-reveal.css';
import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { motionDuration } from './internal/motion';

export interface ImageRevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
  threshold?: number;
  once?: boolean;
}

export function ImageReveal({ children, direction = 'up', duration = 700, delay = 0, threshold = 0.15, once = true, className = '', style, ...props }: ImageRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); if (once) observer.unobserve(root); }
      else if (!once) setVisible(false);
    }, { threshold: Math.min(1, Math.max(0, threshold)) });
    observer.observe(root);
    return () => observer.disconnect();
  }, [once, threshold]);
  return <div {...props} ref={rootRef} className={`at-image-reveal at-image-reveal--${direction} ${className}`} data-visible={visible} style={{ ...style, '--at-image-reveal-duration': `${motionDuration(duration, 700)}ms`, '--at-image-reveal-delay': `${motionDuration(delay, 0)}ms` } as CSSProperties}><div className="at-image-reveal__inner">{children}</div></div>;
}
