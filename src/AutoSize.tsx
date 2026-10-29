import './styles/theme.css';
import './styles/auto-size.css';
import { useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { motionDuration, useBrowserLayoutEffect } from './internal/motion';

export interface AutoSizeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  duration?: number;
}

/** Animates content-driven height changes without controlling visibility. */
export function AutoSize({ children, duration = 250, className = '', style, ...props }: AutoSizeProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  useBrowserLayoutEffect(() => {
    const content = contentRef.current;
    // Without ResizeObserver, keep natural height rather than freezing the initial size.
    if (!content || typeof ResizeObserver === 'undefined') return;
    // Border-box measurements stay correct inside transformed entrance animations.
    const measure = (entries?: ResizeObserverEntry[]) => {
      setHeight(entries?.[0]?.borderBoxSize?.[0]?.blockSize ?? content.offsetHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(content, { box: 'border-box' });
    return () => observer.disconnect();
  }, []);

  const sizeStyle = {
    ...style,
    '--at-auto-size-duration': `${motionDuration(duration, 250)}ms`,
    height: height === undefined ? 'auto' : `${height}px`,
  } as CSSProperties;

  return <div {...props} className={`at-auto-size ${className}`} style={sizeStyle}>
    <div ref={contentRef} className="at-auto-size__content">{children}</div>
  </div>;
}
