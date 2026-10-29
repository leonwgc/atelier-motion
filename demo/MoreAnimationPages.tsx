import { useRef, useState } from 'react';
import { ProgressRing } from 'atelier-motion/progress-ring';
import { Parallax } from 'atelier-motion/parallax';
import { GradientText } from 'atelier-motion/gradient-text';
import { ImageReveal } from 'atelier-motion/image-reveal';
import type { AnimationPageMeta } from './AnimationPages';

function ProgressRingDemo() {
  const [value, setValue] = useState(68);
  return <div className="motion-demo"><div className="motion-demo__actions"><ProgressRing value={value} aria-label="项目完成进度" /><button type="button" onClick={() => setValue((current) => current >= 100 ? 0 : current + 16)}>更新进度</button></div><p className="motion-demo__note">受控数值在 0–100 之间变化，圆环平滑跟随。</p></div>;
}

function ParallaxDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  return <div className="motion-demo">
    <div ref={containerRef} className="motion-demo__parallax-scroll" tabIndex={0} aria-label="可滚动的山间日落视差场景">
      <div className="motion-demo__parallax-intro">向下滚动，看看太阳、远山和前景如何以不同速度移动 ↓</div>
      <div className="motion-demo__parallax-scene">
        <Parallax containerRef={containerRef} distance={24} className="motion-demo__parallax-layer"><span className="motion-demo__parallax-sun" /></Parallax>
        <Parallax containerRef={containerRef} distance={56} className="motion-demo__parallax-layer"><span className="motion-demo__parallax-mountain motion-demo__parallax-mountain--back" /></Parallax>
        <Parallax containerRef={containerRef} distance={112} className="motion-demo__parallax-layer"><span className="motion-demo__parallax-mountain motion-demo__parallax-mountain--front" /></Parallax>
        <div className="motion-demo__parallax-copy"><small>THE JOURNEY BEGINS</small><strong>去看更远的风景</strong></div>
      </div>
      <div className="motion-demo__parallax-outro">继续向下滚动，前景移动得更快，远处的太阳移动得更慢。</div>
    </div>
    <p className="motion-demo__note">场景在独立滚动容器中运行；减少动态效果时各图层保持静止。</p>
    <div className="motion-demo__parallax-example-heading">
      <strong>产品展示 · 页面滚动</strong>
      <span>继续向下滚动，观察背景光晕与数据卡片的相对位移。</span>
    </div>
    <div className="motion-demo__parallax-product">
      <Parallax distance={32} className="motion-demo__parallax-product-layer" aria-hidden="true">
        <span className="motion-demo__parallax-product-glow" />
      </Parallax>
      <div className="motion-demo__parallax-product-window">
        <div className="motion-demo__parallax-product-toolbar"><span /><span /><span /><small>atelier / analytics</small></div>
        <div className="motion-demo__parallax-product-content">
          <small>YOUR GROWTH, AT A GLANCE</small>
          <strong>每一步增长<br />都清晰可见。</strong>
          <div className="motion-demo__parallax-product-chart" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
        </div>
      </div>
      <Parallax distance={88} className="motion-demo__parallax-product-layer" aria-hidden="true">
        <div className="motion-demo__parallax-product-stat"><span>本月增长</span><strong>+32.8%</strong><small>↗ 持续上升</small></div>
      </Parallax>
    </div>
  </div>;
}

export const moreAnimationPages: AnimationPageMeta[] = [
  {
    id: 'progressRing', title: 'ProgressRing 环形进度', icon: '◔', description: '展示确定进度，并平滑响应数值更新。', preview: <ProgressRingDemo />,
    code: `import { useState } from 'react';
import { ProgressRing } from 'atelier-motion/progress-ring';

export function UploadProgress() {
  const [value, setValue] = useState(68);
  return <div>
    <ProgressRing value={value} aria-label="上传进度" />
    <button type="button" onClick={() => setValue(100)}>完成上传</button>
  </div>;
}`,
    rows: [['value', 'number；限制到 0–100', 'required'], ['size', 'number', '96 px'], ['strokeWidth', 'number', '8 px'], ['color / trackColor', 'string', '主题色 / 边框色'], ['duration', 'number', '450 ms'], ['children', 'ReactNode；圆心内容', '百分比'], ['aria-label', 'string', 'Progress']],
  },
  {
    id: 'parallax', title: 'Parallax 滚动视差', icon: '↟', description: '让太阳、远山和前景随滚动以不同速度移动，营造景深。', preview: <ParallaxDemo />,
    code: `import { useRef } from 'react';
import { Parallax } from 'atelier-motion/parallax';

export function SunsetStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  return <div ref={containerRef} style={{ height: 280, overflowY: 'auto' }}>
    <p>向下滚动，探索山间日落。</p>
    <div style={{ position: 'relative', height: 360, overflow: 'hidden', background: 'linear-gradient(#243b74, #f6a77b)' }}>
      <Parallax containerRef={containerRef} distance={24} style={{ position: 'absolute', inset: 0 }}>
        <span style={{ position: 'absolute', top: 80, right: '20%', width: 80, height: 80, borderRadius: '50%', background: '#ffdda0' }} />
      </Parallax>
      <Parallax containerRef={containerRef} distance={96} style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: 150, background: '#303d69', clipPath: 'polygon(0 80%, 35% 10%, 60% 70%, 80% 20%, 100% 80%, 100% 100%, 0 100%)' }} />
      </Parallax>
    </div>
    <p>近处的山移动得更快，太阳移动得更慢。</p>
  </div>;
}

export function ProductShowcase() {
  return <section style={{ position: 'relative', minHeight: 320, overflow: 'hidden', background: '#ede9ff' }}>
    <Parallax distance={32} style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', top: 30, right: 40, width: 180, height: 180, borderRadius: '50%', background: '#b9a7ff' }} />
    </Parallax>
    <div style={{ position: 'relative', margin: 48, padding: 28, background: 'white', borderRadius: 16 }}>
      <h2>每一步增长都清晰可见。</h2>
      <p>产品数据展示</p>
    </div>
    <Parallax distance={88} style={{ position: 'absolute', inset: 0 }}>
      <strong style={{ position: 'absolute', right: 30, bottom: 30, padding: 18, background: 'white', borderRadius: 12 }}>本月增长 +32.8%</strong>
    </Parallax>
  </section>;
}`,
    rows: [['children', 'ReactNode', 'required'], ['distance', 'number；最大 160 px', '48 px'], ['containerRef', 'RefObject<HTMLElement>', 'window'], ['disabled', 'boolean', 'false']],
  },
  {
    id: 'gradientText', title: 'GradientText 渐变标题', icon: '✦', description: '用于营销标题与重点文案的柔和流动渐变。', preview: <GradientText className="motion-demo__headline">Build something memorable.</GradientText>,
    code: `import { GradientText } from 'atelier-motion/gradient-text';

export function HeroHeadline() {
  return <h1><GradientText colors={['#685cf6', '#e06cae', '#685cf6']}>
    Build something memorable.
  </GradientText></h1>;
}`,
    rows: [['children', 'ReactNode', 'required'], ['colors', '至少两个 CSS 颜色值', '紫色 / 粉色 / 紫色'], ['duration', 'number', '4000 ms'], ['animate', 'boolean', 'true']],
  },
  {
    id: 'imageReveal', title: 'ImageReveal 图片揭示', icon: '▧', description: '图片进入视口时从指定方向逐步显现，适合产品展示区。', preview: <ImageReveal className="motion-demo__image-reveal"><div className="motion-demo__image-art">A closer look</div></ImageReveal>,
    code: `import { ImageReveal } from 'atelier-motion/image-reveal';

export function ProductVisual() {
  return <ImageReveal direction="up" duration={700}>
    <img src="/product-preview.webp" alt="产品界面预览" />
  </ImageReveal>;
}`,
    rows: [['children', 'ReactNode；建议传入带 alt 的图片', 'required'], ['direction', "'left' | 'right' | 'up' | 'down'", 'up'], ['duration', 'number', '700 ms'], ['delay', 'number', '0 ms'], ['threshold', 'number', '0.15'], ['once', 'boolean', 'true']],
  },
];
