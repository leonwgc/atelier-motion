import './styles/theme.css';
import './styles/layout-list.css';
import { useEffect, useRef, type HTMLAttributes, type Key, type ReactNode } from 'react';
import { motionDuration, useBrowserLayoutEffect, useReducedMotion } from './internal/motion';

export interface LayoutListProps<T> extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {
  items: readonly T[];
  getItemKey: (item: T, index: number) => Key;
  renderItem: (item: T, index: number) => ReactNode;
  duration?: number;
  itemClassName?: string;
}

/** Smooths vertical position changes; items must have unique, stable keys. */
export function LayoutList<T>({ items, getItemKey, renderItem, duration = 250, itemClassName = '', className = '', ...props }: LayoutListProps<T>) {
  const nodes = useRef(new Map<Key, HTMLLIElement>());
  const previous = useRef(new Map<Key, number>());
  const animations = useRef(new Map<Key, Animation>());
  const reducedMotion = useReducedMotion();

  useBrowserLayoutEffect(() => {
    const next = new Map<Key, number>();
    const movements: Array<{ key: Key; node: HTMLLIElement; delta: number }> = [];
    // Read layout before starting animations; offsetTop is unaffected by transforms.
    for (const [key, node] of nodes.current) {
      const top = node.offsetTop;
      next.set(key, top);
      const oldTop = previous.current.get(key);
      const running = animations.current.get(key);
      const transform = running && running.playState === 'running' ? getComputedStyle(node).transform : 'none';
      const remainingOffset = transform !== 'none' && typeof DOMMatrixReadOnly !== 'undefined'
        ? new DOMMatrixReadOnly(transform).m42 : 0;
      const delta = oldTop === undefined ? 0 : oldTop + remainingOffset - top;
      if (oldTop !== undefined && oldTop !== top) movements.push({ key, node, delta });
    }
    previous.current = next;
    const milliseconds = motionDuration(duration, 250);
    for (const [key, animation] of animations.current) {
      if (reducedMotion || milliseconds === 0 || !next.has(key) || animation.playState === 'finished') {
        animation.cancel();
        animations.current.delete(key);
      }
    }
    if (reducedMotion || milliseconds === 0) return;
    for (const { key, node, delta } of movements) {
      animations.current.get(key)?.cancel();
      if (delta === 0 || typeof node.animate !== 'function') continue;
      animations.current.set(key, node.animate(
        [{ transform: `translateY(${delta}px)` }, { transform: 'translateY(0)' }],
        { duration: milliseconds, easing: 'cubic-bezier(.2, .7, .2, 1)' },
      ));
    }
  });

  useEffect(() => () => {
    for (const animation of animations.current.values()) animation.cancel();
  }, []);

  return <ul {...props} className={`at-layout-list ${className}`}>
    {items.map((item, index) => {
      const key = getItemKey(item, index);
      return <li key={key} ref={(node) => { if (node) nodes.current.set(key, node); else nodes.current.delete(key); }} className={`at-layout-list__item ${itemClassName}`}>
        {renderItem(item, index)}
      </li>;
    })}
  </ul>;
}
