import { useState, type ReactNode } from 'react';
import { highlightCode } from './highlightCode';
import { newAnimationPages } from './NewAnimationPages';
import { moreAnimationPages } from './MoreAnimationPages';
import { animationDemoPreviews } from './AnimationDemoPreviews';
import { Expand, FlipCard, Transition, TransitionGroup } from 'atelier-motion';

export type AnimationPageId = 'marquee' | 'numberTicker' | 'typingAnimation' | 'blurFade' | 'fadeIn' | 'slideIn' | 'scrollReveal' | 'scaleIn' | 'stagger' | 'expand' | 'pulse' | 'glow' | 'shake' | 'wobble' | 'hoverLift' | 'press' | 'flipIn' | 'flipCard' | 'confetti' | 'shimmer' | 'animatedList' | 'transition' | 'transitionGroup' | 'borderBeam' | 'autoSize' | 'layoutList' | 'ripple' | 'textRotate' | 'scrollProgress' | 'tilt' | 'spotlight' | 'progressRing' | 'parallax' | 'gradientText' | 'imageReveal';
type ApiRow = [string, string, string];

export interface AnimationPageMeta {
  id: AnimationPageId;
  title: string;
  icon: string;
  description: string;
  code: string;
  rows: ApiRow[];
  preview: ReactNode;
}

function ExpandPreview() {
  const [open, setOpen] = useState(false);

  return (
    <div className="animation-expand-demo">
      <button type="button" aria-expanded={open} aria-controls="animation-expand-demo-panel" onClick={() => setOpen((value) => !value)}>
        {open ? '收起项目详情' : '展开项目详情'}
      </button>
      <p className="reference-demo__hint">观察项目简介下方内容高度的平滑变化。</p>
      <div className="animation-expand-preview">
        <div className="animation-expand-preview__summary"><strong>品牌体验升级</strong><span className="reference-demo__badge">进行中</span></div>
      <Expand id="animation-expand-demo-panel" open={open}>
        <div className="animation-expand-preview__details"><p>统一品牌视觉、梳理关键交互，并建立可复用的组件规范。</p><p>负责人：Alex Morgan · 下次评审：周五</p></div>
      </Expand>
      </div>
    </div>
  );
}

export const animationPages: AnimationPageMeta[] = [
  ...moreAnimationPages,
  ...newAnimationPages,
  {
    id: 'marquee', title: 'Marquee 滚动展示', icon: '⇢', description: '以连续循环的轨道展示标签、动态或品牌内容。',
    code: `import { Marquee } from 'atelier-motion/marquee';

export function ProjectMarquee() {
  return (
    <Marquee duration={24} gradient pauseOnHover>
      <span>Design systems</span>
      <span>Product teams</span>
      <span>Made to move</span>
    </Marquee>
  );
}`,
    rows: [['children', 'ReactNode', 'required'], ['duration', 'number', '28 秒'], ['direction', "'left' | 'right'", 'left'], ['pauseOnHover', 'boolean', 'true'], ['gradient', 'boolean', 'false']],
    preview: animationDemoPreviews.marquee,
  },
  {
    id: 'numberTicker', title: 'NumberTicker 数值滚动', icon: '↗', description: '使用缓动数字递增强调统计值和关键指标。',
    code: `import { useState } from 'react';
import { NumberTicker } from 'atelier-motion/number-ticker';

export function MonthlyRevenue() {
  const [revenue, setRevenue] = useState(12840);
  return <div>
    <button type="button" onClick={() => setRevenue((value) => value === 12840 ? 24680 : 12840)}>切换目标数值</button>
    <article><span>本月收入</span><strong><NumberTicker value={revenue} prefix="¥" duration={1600} /></strong></article>
  </div>;
}`,
    rows: [['value', 'number', 'required'], ['startValue', 'number', '0'], ['duration', 'number', '1200 ms'], ['delay', 'number', '0 ms'], ['decimals', 'number', '0'], ['locale', 'string', 'zh-CN'], ['prefix / suffix', 'string', '—']],
    preview: animationDemoPreviews.numberTicker,
  },
  {
    id: 'typingAnimation', title: 'TypingAnimation 打字效果', icon: '▏', description: '逐字输入、停顿并轮播多段短文案。',
    code: `import { TypingAnimation } from 'atelier-motion/typing-animation';

export function RotatingHeadline() {
  return (
    <TypingAnimation
      words={['Build with clarity', 'Ship with confidence']}
      typeSpeed={65}
      pauseDuration={1200}
    />
  );
}`,
    rows: [['words', 'string[]', 'required'], ['typeSpeed', 'number', '75 ms'], ['deleteSpeed', 'number', '38 ms'], ['pauseDuration', 'number', '1300 ms'], ['loop', 'boolean', 'true'], ['cursor', 'boolean', 'true']],
    preview: animationDemoPreviews.typingAnimation,
  },
  {
    id: 'blurFade', title: 'BlurFade 模糊渐入', icon: '◌', description: '让内容以轻微位移和模糊渐显，支持错峰延迟。',
    code: `import { BlurFade } from 'atelier-motion/blur-fade';

export function Intro() {
  return (
    <BlurFade delay={120} duration={600} blur={8} offsetY={12}>
      <h2>Every detail finds its place.</h2>
    </BlurFade>
  );
}`,
    rows: [['children', 'ReactNode', 'required'], ['delay', 'number', '0 ms'], ['duration', 'number', '500 ms'], ['blur', 'number', '6 px'], ['offsetY', 'number', '8 px']],
    preview: animationDemoPreviews.blurFade,
  },
  {
    id: 'fadeIn', title: 'FadeIn 淡入', icon: '◦', description: '让内容以轻柔的透明度渐变进入，可配置延迟与时长。',
    code: `import { FadeIn } from 'atelier-motion/fade-in';

export function Intro() {
  return (
    <FadeIn delay={120} duration={700}>
      <h2>Every detail finds its place.</h2>
    </FadeIn>
  );
}`,
    rows: [['children', 'ReactNode', 'required'], ['delay', 'number', '0 ms'], ['duration', 'number', '500 ms'], ['HTML attributes', 'HTMLAttributes<HTMLDivElement>', '—']],
    preview: animationDemoPreviews.fadeIn,
  },
  {
    id: 'slideIn', title: 'SlideIn 滑入', icon: '⇲', description: '让内容从指定方向平滑滑入，同时淡入显示。',
    code: `import { SlideIn } from 'atelier-motion/slide-in';

export function Intro() {
  return (
    <SlideIn direction="left" distance={24} delay={100} duration={600}>
      <h2>Every detail finds its place.</h2>
    </SlideIn>
  );
}`,
    rows: [['children', 'ReactNode', 'required'], ['direction', "'left' | 'right' | 'up' | 'down'", 'up'], ['distance', 'number', '16 px'], ['delay', 'number', '0 ms'], ['duration', 'number', '500 ms'], ['HTML attributes', 'HTMLAttributes<HTMLDivElement>', '—']],
    preview: animationDemoPreviews.slideIn,
  },
  {
    id: 'scrollReveal', title: 'ScrollReveal 滚动显现', icon: '⌄', description: '元素进入视口时渐入，可选择方向、距离及是否重复触发。',
    code: `import { useRef } from 'react';
import { ScrollReveal } from 'atelier-motion/scroll-reveal';

export function FeatureCard() {
  const scrollRef = useRef<HTMLDivElement>(null);
  return <div>
    <button type="button" onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}>回到顶部</button>
    <div ref={scrollRef} style={{ height: 240, overflowY: 'auto' }} tabIndex={0} aria-label="滚动显现演示区域">
      <div style={{ height: 180 }}>向下滚动 ↓</div>
      <ScrollReveal once={false} distance={36} threshold={0.3}>
        <article><h2>刚好在此刻出现</h2><p>进入可见区域时显现。</p></article>
      </ScrollReveal>
      <div style={{ height: 180 }}>向上滚动可以重播</div>
    </div>
  </div>;
}`,
    rows: [['children', 'ReactNode', 'required'], ['direction', "'left' | 'right' | 'up' | 'down'", 'up'], ['distance', 'number', '16 px'], ['delay / duration', 'number', '0 / 600 ms'], ['threshold', 'number', '0.1'], ['rootMargin', 'string', '0px'], ['once', 'boolean', 'true']],
    preview: animationDemoPreviews.scrollReveal,
  },
  {
    id: 'scaleIn', title: 'ScaleIn 缩放弹入', icon: '⊙', description: '内容从较小比例平滑放大并淡入，适用于卡片、弹窗和菜单。',
    code: `import { ScaleIn } from 'atelier-motion/scale-in';

export function WelcomeCard() {
  return (
    <ScaleIn startScale={0.85} duration={450}>
      <article>Welcome back</article>
    </ScaleIn>
  );
}`,
    rows: [['children', 'ReactNode', 'required'], ['startScale', 'number', '0.88'], ['delay', 'number', '0 ms'], ['duration', 'number', '450 ms']],
    preview: animationDemoPreviews.scaleIn,
  },
  {
    id: 'stagger', title: 'Stagger 错峰动画', icon: '☷', description: '以错峰顺序呈现任意子元素，适合标签、卡片和列表内容。',
    code: `import { Stagger } from 'atelier-motion/stagger';

export function FeatureTags() {
  return (
    <Stagger staggerDelay={90}>
      <span>Fast setup</span>
      <span>Accessible</span>
      <span>Customizable</span>
    </Stagger>
  );
}`,
    rows: [['children', 'ReactNode', 'required'], ['staggerDelay', 'number', '70 ms'], ['duration', 'number', '420 ms'], ['itemClassName', 'string', '—'], ['HTML attributes', 'HTMLAttributes<HTMLDivElement>', '—']],
    preview: animationDemoPreviews.stagger,
  },
  {
    id: 'expand', title: 'Expand 平滑展开', icon: '⌄', description: '对受控内容进行平滑展开与收起，并隐藏折叠内容的辅助技术焦点。',
    code: `import { useState } from 'react';
import { Expand } from 'atelier-motion/expand';

export function Details() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {open ? '收起项目详情' : '展开项目详情'}
      </button>
      <h3>品牌体验升级</h3>
      <Expand open={open}>
        <p>统一品牌视觉、梳理关键交互，并建立可复用的组件规范。</p>
        <p>负责人：Alex Morgan · 下次评审：周五</p>
      </Expand>
    </div>
  );
}`,
    rows: [['children', 'ReactNode', 'required'], ['open', 'boolean', 'required'], ['duration', 'number', '300 ms'], ['HTML attributes', 'HTMLAttributes<HTMLDivElement>', '—']],
    preview: <ExpandPreview />,
  },
  {
    id: 'pulse', title: 'Pulse 呼吸', icon: '◉', description: '以柔和的循环缩放和透明度变化强调需要关注的内容。',
    code: `import { Pulse } from 'atelier-motion/pulse';

export function LiveStatus() {
  return <Pulse duration={1400}><span>● Live now</span></Pulse>;
}`,
    rows: [['children', 'ReactNode', 'required'], ['duration', 'number', '1400 ms'], ['HTML attributes', 'HTMLAttributes<HTMLDivElement>', '—']],
    preview: animationDemoPreviews.pulse,
  },
  {
    id: 'glow', title: 'Glow 柔光', icon: '✧', description: '在内容周围循环显示柔和光晕，可自定义颜色与速度。',
    code: `import { Glow } from 'atelier-motion/glow';

export function Highlight() {
  return <Glow color="#8b7dff" duration={1800}>Featured</Glow>;
}`,
    rows: [['children', 'ReactNode', 'required'], ['color', 'string', '#8b7dff'], ['duration', 'number', '1800 ms']],
    preview: animationDemoPreviews.glow,
  },
  {
    id: 'shake', title: 'Shake 震动反馈', icon: '↔', description: '通过短促的水平抖动反馈错误或无效操作，可用 active 重新触发。',
    code: `import { Shake } from 'atelier-motion/shake';

export function InvalidField() {
  return <Shake active><span role="alert">Please check this field.</span></Shake>;
}`,
    rows: [['children', 'ReactNode', 'required'], ['active', 'boolean', 'true'], ['duration', 'number', '650 ms']],
    preview: animationDemoPreviews.shake,
  },
  {
    id: 'wobble', title: 'Wobble 摇摆反馈', icon: '↝', description: '以轻微旋转摆动吸引注意，可用 active 控制播放与重播。',
    code: `import { Wobble } from 'atelier-motion/wobble';

export function NewFeature() {
  return <Wobble active><span>New feature</span></Wobble>;
}`,
    rows: [['children', 'ReactNode', 'required'], ['active', 'boolean', 'true'], ['duration', 'number', '900 ms']],
    preview: animationDemoPreviews.wobble,
  },
  {
    id: 'hoverLift', title: 'HoverLift 悬停抬升', icon: '⌃', description: '鼠标悬停时轻微上浮，常用于卡片和可点击内容。',
    code: `import { HoverLift } from 'atelier-motion/hover-lift';

export function ProjectCard() {
  return (
    <HoverLift lift={6}>
      <article>Explore the latest projects</article>
    </HoverLift>
  );
}`,
    rows: [['children', 'ReactNode', 'required'], ['lift', 'number', '6 px'], ['duration', 'number', '500 ms']],
    preview: animationDemoPreviews.hoverLift,
  },
  {
    id: 'press', title: 'Press 按压反馈', icon: '●', description: '指针按下时轻微缩小，提供即时的交互反馈。',
    code: `import { Press } from 'atelier-motion/press';

export function PressableCard() {
  return (
    <Press>
      <button type="button">Press and hold</button>
    </Press>
  );
}`,
    rows: [['children', 'ReactNode', 'required'], ['duration', 'number', '500 ms']],
    preview: animationDemoPreviews.press,
  },
  {
    id: 'flipIn', title: 'FlipIn 翻转进入', icon: '⟳', description: '内容以 3D 翻转并淡入，可选择绕 X 或 Y 轴旋转。',
    code: `import { FlipIn } from 'atelier-motion/flip-in';

export function RevealCard() {
  return <FlipIn direction="y" duration={600}><article>Just revealed</article></FlipIn>;
}`,
    rows: [['children', 'ReactNode', 'required'], ['direction', "'x' | 'y'", 'y'], ['delay', 'number', '0 ms'], ['duration', 'number', '600 ms']],
    preview: animationDemoPreviews.flipIn,
  },
  {
    id: 'flipCard', title: 'FlipCard 翻转卡片', icon: '▣', description: '通过外部状态控制卡片正反面翻转。',
    code: `import { useState } from 'react';
import { FlipCard } from 'atelier-motion/flip-card';

export function MemberCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div>
      <button type="button" aria-pressed={flipped} onClick={() => setFlipped((value) => !value)}>
        {flipped ? '翻回正面' : '翻到背面'}
      </button>
      <FlipCard
        flipped={flipped}
        aria-label="Alex Morgan 成员名片"
        front={<article><span>正面 / PROFILE</span><strong>Alex Morgan</strong><p>产品设计师</p></article>}
        back={<article><span>背面 / ABOUT</span><strong>让好想法成为好体验</strong><p>专注产品体验与设计系统</p></article>}
      />
    </div>
  );
}`,
    rows: [['front / back', 'ReactNode', 'required'], ['flipped', 'boolean', 'false'], ['direction', "'horizontal' | 'vertical'", 'horizontal'], ['HTML attributes', 'HTMLAttributes<HTMLDivElement>', '—']],
    preview: <FlipCardPreview />,
  },
  {
    id: 'confetti', title: 'Confetti 庆祝粒子', icon: '✳', description: '在内容周围播放轻量庆祝粒子，支持数量、颜色与时长。',
    code: `import { Confetti } from 'atelier-motion/confetti';

export function SuccessMessage() {
  return (
    <Confetti count={24} colors={['#7c3aed', '#06b6d4', '#f59e0b']}>
      <strong>Payment complete!</strong>
    </Confetti>
  );
}`,
    rows: [['children', 'ReactNode', 'optional'], ['active', 'boolean', 'true'], ['count', 'number', '24'], ['duration', 'number', '1800 ms'], ['colors', 'string[]', '内置配色']],
    preview: animationDemoPreviews.confetti,
  },
  {
    id: 'shimmer', title: 'Shimmer 流光', icon: '✧', description: '为内容表面添加柔和的掠光效果，可自定义高光颜色。',
    code: `import { Shimmer } from 'atelier-motion/shimmer';

export function Highlight() {
  return (
    <Shimmer duration={1800}>
      <strong>Ready for the next release</strong>
    </Shimmer>
  );
}`,
    rows: [['children', 'ReactNode', 'required'], ['duration', 'number', '1800 ms'], ['highlight', 'string', '半透明白色']],
    preview: animationDemoPreviews.shimmer,
  },
  {
    id: 'animatedList', title: 'AnimatedList 列表渐入', icon: '☷', description: '以错峰渐入动画呈现动态列表内容。',
    code: `import { useState } from 'react';
import { AnimatedList } from 'atelier-motion/animated-list';

const initialActivities = [
  { id: 1, title: '工作区已创建', detail: '团队现在可以开始协作' },
  { id: 2, title: '设计评审已完成', detail: '8 条意见均已解决' },
];

export function ActivityFeed() {
  const [activities, setActivities] = useState(initialActivities);
  const [nextId, setNextId] = useState(3);
  return <div>
    <button type="button" disabled={activities.length >= 6} onClick={() => {
      setActivities((items) => [{ id: nextId, title: \`新增项目动态 \${nextId}\`, detail: '刚刚更新' }, ...items]);
      setNextId((id) => id + 1);
    }}>添加动态</button>
    <button type="button" onClick={() => { setActivities(initialActivities); setNextId(3); }}>重置列表</button>
    <AnimatedList items={activities} getItemKey={(item) => item.id}
      renderItem={(item) => <article><strong>{item.title}</strong><p>{item.detail}</p></article>}
      staggerDelay={100} />
  </div>;
}`,
    rows: [['items', 'ReactNode[] | T[]', 'required'], ['renderItem', '(item: T, index: number) => ReactNode', '自定义结构化数据的列表项'], ['getItemKey', '(item: T, index: number) => Key', '—'], ['staggerDelay', 'number', '70 ms'], ['duration', 'number', '420 ms'], ['itemClassName', 'string', '—'], ['HTML attributes', 'HTMLAttributes<HTMLUListElement>', '—']],
    preview: animationDemoPreviews.animatedList,
  },
  {
    id: 'transition', title: 'Transition 单项过渡', icon: '↕', description: '为条件显示的面板或内容提供统一的进入、退出生命周期。',
    code: `import { useState } from 'react';
import { Transition } from 'atelier-motion/transition';

export function FilterPanel() {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? '收起筛选面板' : '展开筛选面板'}</button>
      <Transition in={open} animation="collapse" timeout={450}>
        <section><h3>项目筛选</h3><p>当前条件：进行中 · 设计团队 · 本月更新</p></section>
      </Transition>
    </div>
  );
}`,
    rows: [['in', 'boolean', 'true'], ['animation', "'fade' | 'slide-up' | 'collapse' | 'none'", 'fade'], ['timeout', 'number', '200 ms'], ['appear', 'boolean', 'false'], ['mountOnEnter / unmountOnExit', 'boolean', 'true'], ['exit', 'ReactNode', 'children'], ['classNames', 'string | Partial<Record<TransitionStatus, string>>', '—'], ['onEnter / onEntered', '(node: HTMLDivElement) => void', '—'], ['onExit / onExited', '(node: HTMLDivElement) => void', '—']],
    preview: <SingleTransitionDemo />,
  },
  {
    id: 'transitionGroup', title: 'TransitionGroup 动态项过渡', icon: '⇅', description: '按稳定 key 管理子项增删；表单数据立即变化，退场项仅保留视觉快照。',
    code: "import { useState } from 'react';\nimport { Transition } from 'atelier-motion/transition';\nimport { TransitionGroup } from 'atelier-motion/transition-group';\n\nexport function TransitionGroupDemo() {\n  const [members, setMembers] = useState([{ id: 1, name: 'Alex Chen' }, { id: 2, name: 'Morgan Lee' }]);\n  const [nextId, setNextId] = useState(3);\n  return <div className=\"animation-transition-demo\">\n    <button type=\"button\" onClick={() => { setMembers((items) => [...items, { id: nextId, name: '' }]); setNextId((id) => id + 1); }}>＋ 添加成员</button>\n    <TransitionGroup className=\"animation-transition-list\">\n      {members.map((member, index) => <Transition key={member.id} animation=\"slide-up\" timeout={200} exit={<div className=\"animation-transition-exit\">{member.name || `成员 ${index + 1}`} 已移除</div>}>\n        <div className=\"animation-transition-row\">\n          <input aria-label={`成员 ${index + 1} 姓名`} placeholder=\"成员姓名\" value={member.name} onChange={(event) => { const name = event.target.value; setMembers((items) => items.map((item) => item.id === member.id ? { ...item, name } : item)); }} />\n          <button type=\"button\" aria-label={`移除成员 ${index + 1}`} onClick={() => setMembers((items) => items.filter((item) => item.id !== member.id))}>×</button>\n        </div>\n      </Transition>)}\n    </TransitionGroup>\n  </div>;\n}",
    rows: [['children', 'keyed Transition elements', 'required'], ['className', 'string', '—'], ['exit snapshot', 'Transition.exit: ReactNode', 'optional'], ['removal', 'data is removed immediately', '—']],
    preview: <TransitionGroupDemo />,
  },
  {
    id: 'borderBeam', title: 'BorderBeam 边框流光', icon: '✧', description: '为重点内容添加可控颜色和速度的流动边框。',
    code: `import { useState } from 'react';
import { BorderBeam } from 'atelier-motion/border-beam';

export function HighlightCard() {
  const [paused, setPaused] = useState(false);
  return <div>
    <button type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? '继续流光' : '暂停流光'}</button>
    <BorderBeam color="#2f9472" duration={3} paused={paused}>
      <article><h2>让创意持续流动</h2><p>重点内容值得被温柔地强调。</p></article>
    </BorderBeam>
  </div>;
}`,
    rows: [['children', 'ReactNode', 'required'], ['color', 'string', '#8b7dff'], ['duration', 'number', '5 秒'], ['paused', 'boolean', 'false'], ['className', 'string', '—']],
    preview: animationDemoPreviews.borderBeam,
  },
];

function SingleTransitionDemo() {
  const [open, setOpen] = useState(true);
  return <div className="animation-transition-demo"><div className="reference-demo__actions"><button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? '收起筛选面板' : '展开筛选面板'}</button><span className="reference-demo__hint" aria-live="polite">面板已{open ? '展开' : '收起'}</span></div><Transition in={open} animation="collapse" timeout={450}><div className="animation-transition-panel"><span className="reference-demo__badge">筛选条件</span><strong>项目筛选</strong><p>当前条件：进行中 · 设计团队 · 本月更新</p></div></Transition></div>;
}

function TransitionGroupDemo() {
  const [members, setMembers] = useState([{ id: 1, name: 'Alex Chen' }, { id: 2, name: 'Morgan Lee' }]);
  const [nextId, setNextId] = useState(3);
  return <div className="animation-transition-demo">
    <button type="button" onClick={() => { setMembers((items) => [...items, { id: nextId, name: '' }]); setNextId((id) => id + 1); }}>＋ 添加成员</button>
    <TransitionGroup className="animation-transition-list">
      {members.map((member, index) => <Transition key={member.id} animation="slide-up" timeout={200} exit={<div className="animation-transition-exit">{member.name || `成员 ${index + 1}`} 已移除</div>}>
        <div className="animation-transition-row">
          <input aria-label={`成员 ${index + 1} 姓名`} placeholder="成员姓名" value={member.name} onChange={(event) => { const name = event.target.value; setMembers((items) => items.map((item) => item.id === member.id ? { ...item, name } : item)); }} />
          <button type="button" aria-label={`移除成员 ${index + 1}`} onClick={() => setMembers((items) => items.filter((item) => item.id !== member.id))}>×</button>
        </div>
      </Transition>)}
    </TransitionGroup>
  </div>;
}

export function isAnimationPageId(id: string): id is AnimationPageId {
  return animationPages.some((item) => item.id === id);
}

export function AnimationPage({ id }: { id: AnimationPageId }) {
  const [showCode, setShowCode] = useState(false);
  const [replay, setReplay] = useState(0);
  const item = animationPages.find((page) => page.id === id);
  if (!item) return null;

  return <>
    <div className="page-heading">
      <div className="eyebrow"><span className="eyebrow__dot" />动画组件</div>
      <div className="page-heading__row"><div><h1>{item.title}</h1><p>{item.description}</p></div><span className="heading-badge">{item.title.split(' ')[0]}</span></div>
    </div>
    <section className="example-card">
      <div className="example-card__heading"><div><h3>交互示例</h3><p>体验组件效果，再查看可直接使用的 TypeScript 示例。</p></div><button type="button" className={`code-toggle ${showCode ? 'code-toggle--active' : ''}`} onClick={() => setShowCode((visible) => !visible)}><span>{`</>`}</span>{showCode ? '收起代码' : '查看完整代码'}</button></div>
      <div className="preview-toolbar"><button type="button" onClick={() => setReplay((value) => value + 1)}>↻ 重播动画</button></div><div key={replay} className="example-card__preview">{item.preview}</div>
      {showCode && <pre className="code-panel"><code dangerouslySetInnerHTML={{ __html: highlightCode(item.code) }} /></pre>}
    </section>
    <section className="api-table-section"><div className="eyebrow"><span className="eyebrow__dot" /> API REFERENCE</div><h2>组件属性</h2><div className="api-table-wrap"><table className="api-table"><thead><tr><th>属性</th><th>类型</th><th>默认值</th></tr></thead><tbody>{item.rows.map(([prop, type, fallback]) => <tr key={prop}><td><code>{prop}</code></td><td>{type}</td><td>{fallback}</td></tr>)}</tbody></table></div></section>
  </>;
}
function FlipCardPreview() {
  const [flipped, setFlipped] = useState(false);
  return <div className="animation-transition-demo"><div className="reference-demo__actions"><button type="button" aria-pressed={flipped} onClick={() => setFlipped((value) => !value)}>{flipped ? '翻回正面' : '翻到背面'}</button><span className="reference-demo__hint" aria-live="polite">当前：{flipped ? '背面 · 成员详情' : '正面 · 成员名片'}</span></div><FlipCard className="animation-flip-card" flipped={flipped} aria-label="Alex Morgan 成员名片" front={<div className="animation-flip-card__profile"><small>正面 / PROFILE</small><span className="animation-flip-card__avatar">AM</span><strong>Alex Morgan</strong><span>产品设计师</span></div>} back={<div className="animation-flip-card__profile"><small>背面 / ABOUT</small><strong>让好想法成为好体验</strong><span>专注产品体验与设计系统</span></div>} /></div>;
}
