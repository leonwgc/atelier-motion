import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AnimationPage, animationPages } from '../demo/AnimationPages';
import { scenarioExamples } from '../demo/ScenarioExamples';

describe('全部组件的 demo 契约', () => {
  it('35 个组件具有唯一页面和补充场景', () => {
    expect(animationPages).toHaveLength(35);
    expect(new Set(animationPages.map((page) => page.id)).size).toBe(35);
    expect(Object.keys(scenarioExamples).sort()).toEqual(animationPages.map((page) => page.id).sort());
  });
  for (const page of animationPages) {
    it(`${page.id} 渲染两个场景，代码与独立重播可用`, () => {
      render(<AnimationPage id={page.id} />);
      const scenes = screen.getAllByRole('region', { name: /^场景 / });
      expect(scenes).toHaveLength(2);
      for (const scene of scenes) {
        fireEvent.click(within(scene).getByRole('button', { name: /查看完整代码/ }));
        expect(scene.querySelector('code')).toHaveTextContent('import');
        expect(scene.querySelector('code')).toHaveTextContent('export function');
        fireEvent.click(within(scene).getByRole('button', { name: /重播动画/ }));
        expect(within(scene).getByRole('button', { name: /收起代码/ })).toHaveAttribute('aria-expanded', 'true');
      }
      expect(scenarioExamples[page.id].code).toContain(`atelier-motion/`);
    });
  }
});

it('FAQ 同时只展开一个回答', () => {
  render(<AnimationPage id="expand" />);
  const first = screen.getByRole('button', { name: '可以随时修改套餐吗？' });
  const second = screen.getByRole('button', { name: '团队成员如何加入？' });
  expect(first).toHaveAttribute('aria-expanded', 'true');
  fireEvent.click(second);
  expect(first).toHaveAttribute('aria-expanded', 'false');
  expect(second).toHaveAttribute('aria-expanded', 'true');
});

it('体验码校验反馈失败和成功', () => {
  render(<AnimationPage id="shake" />);
  fireEvent.click(screen.getByRole('button', { name: '验证体验码' }));
  expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '2026' } });
  fireEvent.click(screen.getByRole('button', { name: '验证体验码' }));
  expect(screen.getByRole('status')).toHaveTextContent('验证成功');
});

it('重播任务场景不重置上传场景', () => {
  render(<AnimationPage id="progressRing" />);
  fireEvent.click(screen.getByRole('button', { name: '继续上传' }));
  fireEvent.click(screen.getByRole('button', { name: '完成一项任务' }));
  expect(screen.getByRole('progressbar', { name: '每周任务完成进度' })).toHaveAttribute('aria-valuenow', '60');
  const scene = screen.getByRole('region', { name: /场景 2/ });
  fireEvent.click(within(scene).getByRole('button', { name: /重播动画/ }));
  expect(screen.getByRole('progressbar', { name: '每周任务完成进度' })).toHaveAttribute('aria-valuenow', '40');
  expect(screen.getByRole('progressbar', { name: '品牌手册上传进度' })).toHaveAttribute('aria-valuenow', '84');
});
