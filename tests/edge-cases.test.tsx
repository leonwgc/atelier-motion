import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LayoutList, Ripple, TextRotate, Transition, TransitionGroup } from '../src';

const tick = (ms: number) => act(() => vi.advanceTimersByTime(ms));

describe('列表重排与动画取消', () => {
  function setup() {
    vi.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockImplementation(function (this: HTMLElement) {
      return Array.from(this.parentElement?.children ?? []).indexOf(this) * 40;
    });
    const animations: { cancel: ReturnType<typeof vi.fn>; playState: string }[] = [];
    const animate = vi.fn(() => {
      const animation = { cancel: vi.fn(), playState: 'running' };
      animations.push(animation);
      return animation;
    });
    vi.stubGlobal('Animation', class {});
    const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'animate');
    Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: animate });
    const restore = () => {
      if (original) Object.defineProperty(HTMLElement.prototype, 'animate', original);
      else Reflect.deleteProperty(HTMLElement.prototype, 'animate');
    };
    return { animate, animations, restore };
  }
  const props = { getItemKey: (item: string) => item, renderItem: (item: string) => <span>{item}</span> };
  it('以真实位置差生成关键帧，连续重排取消旧动画，删除及卸载清理', () => {
    const { animate, animations, restore } = setup();
    try {
      const { rerender, unmount } = render(<LayoutList {...props} items={['A', 'B']} />);
      expect(animate).not.toHaveBeenCalled();
      rerender(<LayoutList {...props} items={['B', 'A']} />);
      expect(animate).toHaveBeenCalledWith([{ transform: 'translateY(-40px)' }, { transform: 'translateY(0)' }], expect.objectContaining({ duration: 250 }));
      expect(animate).toHaveBeenCalledWith([{ transform: 'translateY(40px)' }, { transform: 'translateY(0)' }], expect.anything());
      rerender(<LayoutList {...props} items={['A', 'B']} />);
      expect(animations[0].cancel).toHaveBeenCalledOnce(); expect(animations[1].cancel).toHaveBeenCalledOnce();
      rerender(<LayoutList {...props} items={[]} />);
      expect(animations[2].cancel).toHaveBeenCalledOnce(); expect(animations[3].cancel).toHaveBeenCalledOnce();
      rerender(<LayoutList {...props} items={['A', 'B']} />);
      rerender(<LayoutList {...props} items={['B', 'A']} />); unmount();
      expect(animations.every((animation) => animation.cancel.mock.calls.length > 0)).toBe(true);
    } finally { restore(); }
  });
  it('动态关闭动画取消进行中的任务，恢复后可再次播放', () => {
    const { animate, animations, restore } = setup();
    try {
      const { rerender } = render(<LayoutList {...props} items={['A', 'B']} />);
      rerender(<LayoutList {...props} items={['B', 'A']} />);
      rerender(<LayoutList {...props} duration={0} items={['A', 'B']} />);
      expect(animate).toHaveBeenCalledTimes(2); expect(animations.every((item) => item.cancel.mock.calls.length === 1)).toBe(true);
      rerender(<LayoutList {...props} duration={500} items={['B', 'A']} />);
      expect(animate).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ duration: 500 }));
    } finally { restore(); }
  });
});

describe('连续过渡与动态参数', () => {
  it('退场中重新加入同一 key 不会被旧回调删除', () => {
    vi.useFakeTimers(); const exited = vi.fn();
    const content = (visible: boolean) => <TransitionGroup>{visible && <Transition key="a" timeout={100} onExited={exited}>A</Transition>}</TransitionGroup>;
    const { rerender } = render(content(true)); tick(100);
    rerender(content(false)); tick(50); rerender(content(true)); tick(200);
    expect(screen.getAllByText('A')).toHaveLength(1); expect(exited).not.toHaveBeenCalled();
    rerender(content(false)); tick(100); expect(screen.queryByText('A')).toBeNull(); expect(exited).toHaveBeenCalledOnce();
  });
  it('动态更新 timeout 和回调，不调用过时回调', () => {
    vi.useFakeTimers(); const old = vi.fn(); const latest = vi.fn();
    const { rerender } = render(<Transition appear timeout={300} onEntered={old}>A</Transition>);
    tick(50); rerender(<Transition appear timeout={100} onEntered={latest}>A</Transition>);
    tick(99); expect(latest).not.toHaveBeenCalled(); tick(1); expect(latest).toHaveBeenCalledOnce(); expect(old).not.toHaveBeenCalled();
  });
  it('初始隐藏后挂载，保留退出节点并标记隐藏', () => {
    vi.useFakeTimers(); const { rerender } = render(<Transition in={false}>A</Transition>);
    expect(screen.queryByText('A')).toBeNull();
    rerender(<Transition in unmountOnExit={false}>A</Transition>); tick(200); expect(screen.getByText('A')).toBeVisible();
    rerender(<Transition in={false} unmountOnExit={false}>A</Transition>); tick(200);
    expect(screen.getByText('A').closest('.at-transition')).toHaveAttribute('aria-hidden', 'true');
  });
  it('轮换中缩短数组、更新回调和切换受控模式', () => {
    vi.useFakeTimers(); const old = vi.fn(); const latest = vi.fn();
    const { rerender } = render(<TextRotate words={['A', 'B', 'C']} defaultIndex={2} interval={100} onIndexChange={old} />);
    rerender(<TextRotate words={['X', 'Y']} interval={100} onIndexChange={latest} />);
    expect(screen.getByText('X')).toBeInTheDocument(); tick(100); expect(latest).toHaveBeenCalledWith(1); expect(old).not.toHaveBeenCalled();
    rerender(<TextRotate words={['X', 'Y']} index={0} interval={100} />); tick(500); expect(screen.getByText('X')).toBeInTheDocument(); expect(vi.getTimerCount()).toBe(0);
  });
});

describe('涟漪坐标、事件与禁用组合', () => {
  it.each(['mouse', 'touch'])('%s 点击按缩放后的坐标定位；键盘激活从中心扩散', (pointerType) => {
    vi.useFakeTimers(); const { container } = render(<Ripple><button>操作</button></Ripple>);
    const button = screen.getByRole('button');
    vi.spyOn(button, 'getBoundingClientRect').mockReturnValue(new DOMRect(10, 20, 200, 100));
    vi.spyOn(button, 'offsetWidth', 'get').mockReturnValue(100); vi.spyOn(button, 'offsetHeight', 'get').mockReturnValue(50);
    fireEvent.pointerDown(button, { button: 0, clientX: 60, clientY: 40, pointerType });
    expect(container.querySelector('.at-ripple__wave')).toHaveStyle({ left: '25px', top: '10px' });
    fireEvent.click(button, { detail: 1 }); expect(container.querySelectorAll('.at-ripple__wave')).toHaveLength(1);
    tick(550); expect(container.querySelector('.at-ripple__wave')).toBeNull();
    fireEvent.click(button, { detail: 0 }); expect(container.querySelector('.at-ripple__wave')).toHaveStyle({ left: '50px', top: '25px' });
  });
  it.each(['native', 'aria', 'wrapper', 'prevented', 'secondary'] as const)('%s 不生成粒子且保留业务语义', (mode) => {
    const action = vi.fn(); const { container } = render(<Ripple disabled={mode === 'wrapper'}><button disabled={mode === 'native'} aria-disabled={mode === 'aria'} onClick={action} onPointerDown={(event) => { if (mode === 'prevented') event.preventDefault(); }}>操作</button></Ripple>);
    const button = screen.getByRole('button'); fireEvent.pointerDown(button, { button: mode === 'secondary' ? 2 : 0 });
    expect(container.querySelector('.at-ripple__wave')).toBeNull();
    if (mode === 'wrapper') { fireEvent.click(button); expect(action).toHaveBeenCalledOnce(); }
  });
});

it('重排时叠加尚未结束的位移，避免连续操作跳动', () => {
  vi.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockImplementation(function (this: HTMLElement) {
    return Array.from(this.parentElement?.children ?? []).indexOf(this) * 40;
  });
  const animate = vi.fn(() => ({ cancel: vi.fn(), playState: 'running' }));
  const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'animate');
  Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: animate });
  vi.stubGlobal('DOMMatrixReadOnly', class { m42 = 15; });
  const originalComputedStyle = window.getComputedStyle;
  vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
    const result = originalComputedStyle(element); result.transform = 'matrix(1, 0, 0, 1, 0, 15)'; return result;
  });
  try {
    const props = { getItemKey: (item: string) => item, renderItem: (item: string) => item };
    const { rerender } = render(<LayoutList {...props} items={['A', 'B']} />);
    rerender(<LayoutList {...props} items={['B', 'A']} />); animate.mockClear();
    rerender(<LayoutList {...props} items={['A', 'B']} />);
    expect(animate).toHaveBeenCalledWith([{ transform: 'translateY(55px)' }, { transform: 'translateY(0)' }], expect.anything());
  } finally {
    if (original) Object.defineProperty(HTMLElement.prototype, 'animate', original);
    else Reflect.deleteProperty(HTMLElement.prototype, 'animate');
  }
});
