import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AutoSize, ImageReveal, NumberTicker, Parallax, Ripple, ScrollProgress, ScrollReveal, Spotlight, Tilt, TypingAnimation } from '../src';

describe('浏览器观察器', () => {
  for (const Component of [ScrollReveal, ImageReveal]) {
    it(`${Component.name} 进入、离开、重复显现与清理`, () => {
      let notify: (visible: boolean) => void = () => {};
      const disconnect = vi.fn(); const unobserve = vi.fn();
      vi.stubGlobal('IntersectionObserver', class {
        constructor(callback: (entries: { isIntersecting: boolean }[]) => void) { notify = (visible) => callback([{ isIntersecting: visible }]); }
        observe = vi.fn(); unobserve = unobserve; disconnect = disconnect;
      });
      const { container, rerender, unmount } = render(<Component once={false}>内容</Component>);
      expect(container.firstElementChild).toHaveAttribute('data-visible', 'false');
      act(() => notify(true)); expect(container.firstElementChild).toHaveAttribute('data-visible', 'true');
      act(() => notify(false)); expect(container.firstElementChild).toHaveAttribute('data-visible', 'false');
      rerender(<Component once>内容</Component>); act(() => notify(true)); expect(unobserve).toHaveBeenCalled();
      unmount(); expect(disconnect).toHaveBeenCalledTimes(2);
    });
  }
  it('AutoSize 跟随 border-box 尺寸并断开观察器', () => {
    let resize: (height: number) => void = () => {}; const disconnect = vi.fn();
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: (entries: { borderBoxSize: { blockSize: number }[] }[]) => void) { resize = (height) => callback([{ borderBoxSize: [{ blockSize: height }] }]); }
      observe = vi.fn(); disconnect = disconnect;
    });
    const { container, unmount } = render(<AutoSize>内容</AutoSize>);
    act(() => resize(120)); expect(container.firstElementChild).toHaveStyle({ height: '120px' });
    act(() => resize(240)); expect(container.firstElementChild).toHaveStyle({ height: '240px' });
    unmount(); expect(disconnect).toHaveBeenCalledOnce();
  });
  it('页面滚动进度计算与帧清理', () => {
    vi.useFakeTimers();
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(2000);
    vi.stubGlobal('innerHeight', 1000); vi.stubGlobal('scrollY', 500);
    const { unmount } = render(<ScrollProgress />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
    vi.stubGlobal('scrollY', 1000); fireEvent.scroll(window); act(() => vi.advanceTimersByTime(20));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    unmount(); expect(vi.getTimerCount()).toBe(0);
  });
});

describe('减少动态效果', () => {
  it('数值与打字立即显示，涟漪禁用', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    const { container } = render(<><NumberTicker value={123} /><TypingAnimation words={['欢迎']} /><Ripple><button>操作</button></Ripple><Spotlight>光效</Spotlight></>);
    expect(screen.getByLabelText('123')).toHaveTextContent('123'); expect(screen.getByText('欢迎')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button')); expect(container.querySelector('.at-ripple__wave')).toBeNull();
    expect(screen.getByText('光效')).toHaveAttribute('data-disabled', 'true');
  });
  it('禁用视差和倾斜保留内容', () => {
    const { container } = render(<><Parallax disabled>故事</Parallax><Tilt disabled>卡片</Tilt></>);
    expect(screen.getByText('故事')).toBeVisible(); expect(screen.getByText('卡片')).toBeVisible();
    expect(container.querySelector<HTMLElement>('.at-parallax__inner')?.style.transform).toBe('');
  });
});

it.each([Tilt, Spotlight])('%s 指针移动产生效果、离开复位、禁用阻止效果', (Component) => {
  vi.useFakeTimers();
  const moved = vi.fn();
  const { container, rerender } = render(<Component onPointerMove={moved}>内容</Component>);
  const root = container.firstElementChild!;
  vi.spyOn(root, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 200, 100));
  fireEvent.pointerMove(root, { clientX: 150, clientY: 75, pointerType: 'mouse' });
  act(() => vi.advanceTimersByTime(20));
  expect(moved).toHaveBeenCalledOnce();
  const target = container.querySelector<HTMLElement>('.at-tilt__inner') ?? container.querySelector<HTMLElement>('.at-spotlight')!;
  expect(target.style.transform || target.style.getPropertyValue('--at-spotlight-x')).not.toBe('');
  fireEvent.pointerLeave(root);
  expect(target.style.transform).toBe(''); expect(target.style.getPropertyValue('--at-spotlight-x')).toBe('');
  rerender(<Component disabled>内容</Component>);
  fireEvent.pointerMove(root, { clientX: 150, clientY: 75, pointerType: 'mouse' });
  act(() => vi.advanceTimersByTime(20));
  expect(target.style.transform).toBe(''); expect(target.style.getPropertyValue('--at-spotlight-x')).toBe('');
});

it('数值动画经过延迟到达目标并清理帧', () => {
  vi.useFakeTimers(); const { container, unmount } = render(<NumberTicker value={100} startValue={20} duration={100} delay={100} />);
  expect(container.textContent).toBe('20'); act(() => vi.advanceTimersByTime(90)); expect(container.textContent).toBe('20');
  act(() => vi.advanceTimersByTime(200)); expect(container.textContent).toBe('100'); unmount(); expect(vi.getTimerCount()).toBe(0);
});

it('非循环打字最终停留在最后一句并停止计时', () => {
  vi.useFakeTimers(); const { container } = render(<TypingAnimation words={['AB', 'CD']} loop={false} typeSpeed={10} deleteSpeed={10} pauseDuration={10} />);
  act(() => vi.advanceTimersByTime(500)); expect(container.textContent).toBe('CD'); expect(vi.getTimerCount()).toBe(0);
});
