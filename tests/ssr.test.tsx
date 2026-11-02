// @vitest-environment node
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { AutoSize, ImageReveal, NumberTicker, Parallax, ProgressRing, ScrollProgress, TextRotate, Tilt } from '../src';

it('无 window、观察器或动画 API 时可服务端渲染内容', () => {
  expect(typeof window).toBe('undefined');
  const html = renderToString(<><AutoSize>自然高度</AutoSize><Parallax>故事</Parallax><Tilt>卡片</Tilt><ImageReveal>图片</ImageReveal><NumberTicker value={123} /><ProgressRing value={50} /><ScrollProgress /><TextRotate words={['欢迎', '再见']} /></>);
  expect(html).toContain('自然高度'); expect(html).toContain('height:auto'); expect(html).toContain('欢迎'); expect(html).toContain('aria-valuenow="50"'); expect(html).toContain('aria-label="123"');
});
