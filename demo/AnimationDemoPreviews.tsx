import { useRef, useState, type ReactNode } from 'react';
import { AnimatedList } from 'atelier-motion/animated-list';
import { BlurFade } from 'atelier-motion/blur-fade';
import { BorderBeam } from 'atelier-motion/border-beam';
import { Confetti } from 'atelier-motion/confetti';
import { FadeIn } from 'atelier-motion/fade-in';
import { FlipIn } from 'atelier-motion/flip-in';
import { Glow } from 'atelier-motion/glow';
import { HoverLift } from 'atelier-motion/hover-lift';
import { Marquee } from 'atelier-motion/marquee';
import { NumberTicker } from 'atelier-motion/number-ticker';
import { Press } from 'atelier-motion/press';
import { Pulse } from 'atelier-motion/pulse';
import { ScaleIn } from 'atelier-motion/scale-in';
import { ScrollReveal } from 'atelier-motion/scroll-reveal';
import { Shake } from 'atelier-motion/shake';
import { Shimmer } from 'atelier-motion/shimmer';
import { SlideIn } from 'atelier-motion/slide-in';
import { Stagger } from 'atelier-motion/stagger';
import { TypingAnimation } from 'atelier-motion/typing-animation';
import { Wobble } from 'atelier-motion/wobble';
import type { AnimationPageId } from './AnimationPages';

function Stage({ hint, children }: { hint: string; children: ReactNode }) {
  return <div className="reference-demo"><p className="reference-demo__hint">{hint}</p><div className="reference-demo__stage">{children}</div></div>;
}

function SceneCard({ badge, title, description }: { badge: string; title: string; description: string }) {
  return <article className="reference-demo__card"><span className="reference-demo__badge">{badge}</span><strong>{title}</strong><p>{description}</p></article>;
}

function RevenuePreview() {
  const [value, setValue] = useState(12840);
  return <div className="reference-demo"><p className="reference-demo__hint">切换目标数值，观察新目标如何平滑计数。</p><div className="reference-demo__actions"><button type="button" onClick={() => setValue((current) => current === 12840 ? 24680 : 12840)}>切换目标数值</button></div><div className="reference-demo__metric"><span>本月收入</span><strong><NumberTicker value={value} prefix="¥" duration={1600} /></strong><small>目标 ¥{value.toLocaleString('zh-CN')}</small></div></div>;
}

function RevealPreview() {
  const scrollRef = useRef<HTMLDivElement>(null);
  return <div className="reference-demo"><p className="reference-demo__hint">在下方区域向下滚动，让卡片进入视野；移出后可以再次触发。</p><button type="button" onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}>回到顶部</button><div ref={scrollRef} className="reference-demo__scroll" tabIndex={0} aria-label="滚动显现演示区域"><div className="reference-demo__scroll-spacer">向下滚动 ↓</div><ScrollReveal once={false} distance={36} threshold={0.3}><SceneCard badge="ATELIER MOTION" title="刚好在此刻出现" description="卡片进入可见区域时显现，离开后重新准备。" /></ScrollReveal><div className="reference-demo__scroll-spacer">↑ 向上滚动可以重播</div></div></div>;
}

function PressPreview() {
  const [count, setCount] = useState(0);
  return <div className="reference-demo"><p className="reference-demo__hint">按住按钮观察缩小，松开后恢复；也可用键盘激活。</p><div className="reference-demo__stage"><Press duration={180}><button className="reference-demo__primary" type="button" onClick={() => setCount((current) => current + 1)}>按住体验缩放</button></Press></div><p className="reference-demo__hint" aria-live="polite">已完成 {count} 次点击</p></div>;
}

const initialActivities = [
  { id: 1, title: '工作区已创建', detail: '团队现在可以开始协作' },
  { id: 2, title: '设计评审已完成', detail: '8 条意见均已解决' },
];

function ActivityPreview() {
  const [activities, setActivities] = useState(initialActivities);
  const [nextId, setNextId] = useState(3);
  return <div className="reference-demo"><div className="reference-demo__actions"><button type="button" disabled={activities.length >= 6} onClick={() => { setActivities((items) => [{ id: nextId, title: `新增项目动态 ${nextId}`, detail: '刚刚更新 · 团队成员可见' }, ...items]); setNextId((id) => id + 1); }}>添加动态</button><button type="button" onClick={() => { setActivities(initialActivities); setNextId(3); }}>重置列表</button></div><p className="reference-demo__hint">最多添加 6 项，观察新动态依次进入。</p><AnimatedList className="reference-demo__activity" items={activities} getItemKey={(item) => item.id} renderItem={(item, index) => <article className="reference-demo__activity-row"><span className="reference-demo__badge">{String(index + 1).padStart(2, '0')}</span><span><strong>{item.title}</strong><small>{item.detail}</small></span></article>} staggerDelay={100} /></div>;
}

function BeamPreview() {
  const [paused, setPaused] = useState(false);
  return <div className="reference-demo"><div className="reference-demo__actions"><button type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? '继续流光' : '暂停流光'}</button><span className="reference-demo__hint">沿卡片边缘移动的绿色光线</span></div><BorderBeam color="#2f9472" duration={3} paused={paused} className="reference-demo__beam"><span className="reference-demo__badge">PRO WORKSPACE</span><strong>让创意持续流动</strong><p>重点内容值得被温柔地强调。</p></BorderBeam></div>;
}

export const animationDemoPreviews = {
  marquee: <div className="reference-demo"><p className="reference-demo__hint">内容持续滚动，将鼠标移入下方区域可暂停。</p><div className="reference-demo__marquee"><Marquee duration={16} gradient pauseOnHover>{['设计系统', '团队协作', '无障碍体验', '灵活组合', '细节打磨'].map((label) => <span key={label} className="reference-demo__marquee-item">✦ {label}</span>)}</Marquee></div></div>,
  numberTicker: <RevenuePreview />,
  typingAnimation: <Stage hint="依次输入、停顿、删除，再切换下一句。"><div className="reference-demo__card reference-demo__card--wide"><span className="reference-demo__badge">为团队打造更好的体验</span><TypingAnimation className="reference-demo__typing" words={['让想法清晰呈现', '让协作自然发生', '让细节恰到好处']} typeSpeed={120} deleteSpeed={70} pauseDuration={1500} /><p>观察光标与文字的逐字变化。</p></div></Stage>,
  blurFade: <Stage hint="观察文字和卡片轮廓从模糊到清晰。"><BlurFade duration={750} blur={12} offsetY={18}><SceneCard badge="动画预览" title="从模糊到清晰" description="内容由模糊逐渐显现，适合柔和的登场。" /></BlurFade></Stage>,
  fadeIn: <Stage hint="观察整张卡片从透明到完全显示。"><FadeIn duration={900}><SceneCard badge="动画预览" title="柔和地进入视野" description="减少突兀跳变，让内容自然出现。" /></FadeIn></Stage>,
  slideIn: <Stage hint="位移与透明度一起变化，建立出现的方向感。"><SlideIn direction="left" distance={56} duration={750}><SceneCard badge="动画预览" title="从左侧滑入" description="清晰传达内容进入页面的方向。" /></SlideIn></Stage>,
  scrollReveal: <RevealPreview />,
  scaleIn: <Stage hint="观察卡片从较小尺寸放大至原始大小。"><ScaleIn startScale={0.65} duration={700}><SceneCard badge="工作区" title="欢迎回来" description="重要内容从中心轻轻弹入。" /></ScaleIn></Stage>,
  stagger: <Stage hint="三个步骤依次进入，每项间隔 180ms。"><Stagger className="reference-demo__steps" staggerDelay={180} duration={600}>{['建立工作区', '邀请团队成员', '开始第一个项目'].map((title, index) => <article className="reference-demo__step" key={title}><span className="reference-demo__badge">0{index + 1}</span><strong>{title}</strong></article>)}</Stagger></Stage>,
  pulse: <Stage hint="持续循环，观察服务状态卡片的呼吸变化。"><Pulse duration={1700}><SceneCard badge="实时状态" title="服务运行中" description="轻微缩放与透明度变化提示当前状态。" /></Pulse></Stage>,
  glow: <Stage hint="观察卡片周围的柔和光晕。"><Glow color="#8b7dff" duration={2000}><SceneCard badge="本周精选" title="品牌体验升级" description="让值得关注的项目自然突出。" /></Glow></Stage>,
  shake: <Stage hint="重播动画可再次观察错误反馈。"><Shake duration={650}><SceneCard badge="表单校验" title="请检查邮箱地址" description="邮箱格式不正确，请修改后重新提交。" /></Shake></Stage>,
  wobble: <Stage hint="轻微摇摆吸引注意，随后恢复稳定。"><Wobble duration={900}><SceneCard badge="新功能" title="发现新的工作方式" description="轻轻提示用户有新内容可探索。" /></Wobble></Stage>,
  hoverLift: <Stage hint="鼠标移入卡片观察抬升，移出后恢复。"><HoverLift lift={12} duration={350}><SceneCard badge="项目精选" title="探索最新项目" description="悬停反馈让可探索的内容更明确。" /></HoverLift></Stage>,
  press: <PressPreview />,
  flipIn: <Stage hint="观察卡片绕 Y 轴翻转并逐渐显示。"><FlipIn direction="y" duration={900}><SceneCard badge="内容已更新" title="新内容已准备就绪" description="以翻转动画突出刚出现的信息。" /></FlipIn></Stage>,
  confetti: <Stage hint="重播动画，再次庆祝项目发布成功。"><Confetti count={40} duration={1500}><SceneCard badge="发布成功" title="项目发布成功" description="本次更新已完成，和团队一起庆祝吧。" /></Confetti></Stage>,
  shimmer: <Stage hint="一道柔和的光从卡片表面扫过。"><Shimmer duration={2200}><SceneCard badge="即将发布" title="准备好迎接下一次发布" description="流动高光为重点内容增加一点活力。" /></Shimmer></Stage>,
  animatedList: <ActivityPreview />,
  borderBeam: <BeamPreview />,
} satisfies Partial<Record<AnimationPageId, ReactNode>>;
