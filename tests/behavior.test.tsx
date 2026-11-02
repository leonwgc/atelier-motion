import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AutoSize, Expand, FlipCard, LayoutList, NumberTicker, ProgressRing, Ripple, TextRotate, Transition, TransitionGroup, TypingAnimation } from '../src';
import { motionDuration } from '../src/internal/motion';

const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));

describe('文案与计时器', () => {
  it('自动轮换、悬停暂停、焦点暂停、继续及卸载清理', () => {
    vi.useFakeTimers();
    const change = vi.fn();
    const { container, unmount } = render(<TextRotate words={['A', 'B']} interval={100} onIndexChange={change} />);
    advance(100); expect(screen.getByText('B')).toBeInTheDocument();
    fireEvent.mouseEnter(container.firstElementChild!); advance(500); expect(change).toHaveBeenCalledTimes(1);
    fireEvent.mouseLeave(container.firstElementChild!); advance(100); expect(screen.getByText('A')).toBeInTheDocument();
    fireEvent.focus(container.firstElementChild!); advance(500); expect(change).toHaveBeenCalledTimes(2);
    fireEvent.blur(container.firstElementChild!); advance(100); expect(change).toHaveBeenCalledTimes(3);
    unmount(); expect(vi.getTimerCount()).toBe(0);
  });
  it.each([-1, 3])('受控索引 %s 循环归一化且不自动轮播', (index) => {
    vi.useFakeTimers();
    render(<TextRotate words={['A', 'B']} index={index} />);
    expect(screen.getByText('B')).toBeInTheDocument(); expect(vi.getTimerCount()).toBe(0);
  });
  it.each([{ words: [] }, { words: ['A'] }])('空或单条文案不创建定时器', ({ words }) => {
    vi.useFakeTimers(); const { container } = render(<TextRotate words={words} />);
    expect(container.textContent).toBe(words.join('')); expect(vi.getTimerCount()).toBe(0);
  });
  it('暂停、关闭自动播放、最短间隔', () => {
    vi.useFakeTimers(); const { rerender } = render(<TextRotate words={['A', 'B']} paused />);
    expect(vi.getTimerCount()).toBe(0);
    rerender(<TextRotate words={['A', 'B']} autoPlay={false} />); expect(vi.getTimerCount()).toBe(0);
    rerender(<TextRotate words={['A', 'B']} interval={0} />);
    advance(99); expect(screen.getByText('A')).toBeInTheDocument(); advance(1); expect(screen.getByText('B')).toBeInTheDocument();
  });
  it('打字逐字出现，更新内容后重新开始，卸载清理', () => {
    vi.useFakeTimers(); const { container, rerender, unmount } = render(<TypingAnimation words={['AB']} typeSpeed={20} />);
    advance(20); expect(container.textContent).toBe('A'); advance(20); expect(container.textContent).toBe('AB');
    rerender(<TypingAnimation words={['CD']} typeSpeed={20} />); advance(20); expect(container.textContent).toBe('C');
    unmount(); expect(vi.getTimerCount()).toBe(0);
  });
  it('空打字内容不调度任务', () => {
    vi.useFakeTimers(); render(<TypingAnimation words={[]} />); expect(vi.getTimerCount()).toBe(0);
  });
  it('数值显示格式、无动画更新和可访问目标值', () => {
    const { rerender } = render(<NumberTicker value={12.5} decimals={1} suffix="%" duration={0} />);
    expect(screen.getByLabelText('12.5%')).toHaveTextContent('12.5%');
    rerender(<NumberTicker value={20} prefix="¥" duration={0} />); expect(screen.getByLabelText('¥20')).toHaveTextContent('¥20');
  });
});

describe('过渡生命周期', () => {
  it('进入、退出回调和退场快照', () => {
    vi.useFakeTimers(); const entered = vi.fn(); const exited = vi.fn();
    const { rerender } = render(<Transition appear timeout={100} onEntered={entered}>内容</Transition>);
    advance(100); expect(entered).toHaveBeenCalledTimes(1);
    rerender(<Transition in={false} timeout={100} onExited={exited} exit={<span>已删除</span>}>内容</Transition>);
    expect(screen.queryByText('内容')).not.toBeInTheDocument(); expect(screen.getByText('已删除').closest('.at-transition')).toHaveAttribute('aria-hidden', 'true');
    advance(100); expect(exited).toHaveBeenCalledTimes(1); expect(screen.queryByText('已删除')).not.toBeInTheDocument();
  });
  it('快速退出再进入取消过时的退出回调', () => {
    vi.useFakeTimers(); const exited = vi.fn(); const { rerender, unmount } = render(<Transition onExited={exited}>内容</Transition>);
    rerender(<Transition in={false} onExited={exited}>内容</Transition>); advance(50);
    rerender(<Transition in onExited={exited}>内容</Transition>); advance(250);
    expect(exited).not.toHaveBeenCalled(); expect(screen.getByText('内容')).toBeVisible(); unmount(); expect(vi.getTimerCount()).toBe(0);
  });
  it('TransitionGroup 保留退场项至超时，再删除', () => {
    vi.useFakeTimers(); const { rerender } = render(<TransitionGroup><Transition key="a" timeout={100}>A</Transition><Transition key="b" timeout={100}>B</Transition></TransitionGroup>);
    advance(100); rerender(<TransitionGroup><Transition key="b" timeout={100}>B</Transition></TransitionGroup>);
    expect(screen.getByText('A')).toBeInTheDocument(); advance(100); expect(screen.queryByText('A')).not.toBeInTheDocument(); expect(screen.getByText('B')).toBeInTheDocument();
  });
});

describe('可访问性与输入边界', () => {
  it.each([[NaN, 0], [-10, 0], [200, 100], [42, 42]])('环形进度 %s 限制为 %s', (value, expected) => {
    render(<ProgressRing value={value} aria-label="进度" />); expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(expected));
  });
  it.each([[NaN, 250], [Infinity, 250], [-1, 0], [120, 120]])('时长 %s 规范化为 %s', (value, expected) => {
    expect(motionDuration(value, 250)).toBe(expected);
  });
  it('折叠内容隐藏，翻转卡片仅暴露当前面', () => {
    const { rerender } = render(<Expand open={false}>详情</Expand>);
    expect(screen.getByText('详情').closest('.at-expand')).toHaveAttribute('aria-hidden', 'true');
    rerender(<FlipCard flipped front={<span>正面</span>} back={<span>背面</span>} />);
    expect(screen.getByText('正面').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('背面').parentElement).toHaveAttribute('aria-hidden', 'false');
  });
  it('无 ResizeObserver 时保留自然高度', () => {
    vi.stubGlobal('ResizeObserver', undefined); const { container } = render(<AutoSize>动态内容</AutoSize>);
    expect(container.firstElementChild).toHaveStyle({ height: 'auto' });
  });
  it('列表排序保留节点身份且支持空列表', () => {
    const props = { getItemKey: (item: string) => item, renderItem: (item: string) => <input aria-label={item} defaultValue={item} /> };
    const { rerender } = render(<LayoutList {...props} items={['A', 'B']} />);
    const original = screen.getByLabelText('A'); fireEvent.change(original, { target: { value: '已编辑' } });
    rerender(<LayoutList {...props} items={['B', 'A']} />); expect(screen.getByLabelText('A')).toBe(original); expect(original).toHaveValue('已编辑');
    rerender(<LayoutList {...props} items={[]} />); expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
  it('涟漪保留 ref 和事件，完成后清理粒子', () => {
    vi.useFakeTimers(); const ref = createRef<HTMLButtonElement>(); const click = vi.fn();
    const { container, unmount } = render(<Ripple duration={100}><button ref={ref} onClick={click}>操作</button></Ripple>);
    fireEvent.click(screen.getByRole('button')); expect(click).toHaveBeenCalledTimes(1); expect(ref.current).toBe(screen.getByRole('button'));
    expect(container.querySelectorAll('.at-ripple__wave')).toHaveLength(1); advance(100); expect(container.querySelectorAll('.at-ripple__wave')).toHaveLength(0);
    unmount(); expect(vi.getTimerCount()).toBe(0);
  });
  it.each(['disabled', 'prevented', 'zero'] as const)('涟漪 %s 时不生成粒子', (mode) => {
    const { container } = render(<Ripple disabled={mode === 'disabled'} duration={mode === 'zero' ? 0 : 100}><button onClick={(event) => { if (mode === 'prevented') event.preventDefault(); }}>操作</button></Ripple>);
    fireEvent.click(screen.getByRole('button')); expect(container.querySelector('.at-ripple__wave')).toBeNull();
  });
});
