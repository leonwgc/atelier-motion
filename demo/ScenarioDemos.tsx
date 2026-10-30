import { useRef, useState } from 'react';
import {
  AnimatedList, AutoSize, BlurFade, BorderBeam, Confetti, Expand, FadeIn,
  FlipCard, FlipIn, Glow, GradientText, HoverLift, ImageReveal, LayoutList,
  Marquee, NumberTicker, Parallax, Press, ProgressRing, Pulse, Ripple,
  ScaleIn, ScrollProgress, ScrollReveal, Shake, Shimmer, SlideIn, Spotlight,
  Stagger, TextRotate, Tilt, Transition, TransitionGroup, TypingAnimation, Wobble,
} from 'atelier-motion';

export function MarqueeScenario() {
  return <Marquee direction="right" duration={32} gradient pauseOnHover>
    {['“上手很快，团队很喜欢。” — 林', '“细节让协作更轻松。” — 陈', '“每次交付都更从容。” — 周'].map((quote) =>
      <blockquote key={quote} className="scenario-card">{quote}</blockquote>)}
  </Marquee>;
}

export function NumberTickerScenario() {
  const [rate, setRate] = useState(92.5);
  return <div className="motion-demo">
    <label>目标完成率 {rate}% <input type="range" min="0" max="100" step="0.5" value={rate} onChange={(event) => setRate(Number(event.target.value))} /></label>
    <div className="reference-demo__metric"><span>本周目标完成率</span><strong><NumberTicker value={rate} decimals={1} suffix="%" duration={700} /></strong></div>
  </div>;
}

export function TypingAnimationScenario() {
  return <div className="scenario-terminal"><span>工作区初始化</span><p><TypingAnimation words={['依赖检查完成，欢迎开始创作。']} typeSpeed={100} loop={false} cursor={false} /></p></div>;
}

export function BlurFadeScenario() {
  return <div className="scenario-grid">{['建立工作区', '邀请协作者', '开启第一个项目'].map((step, index) =>
    <BlurFade key={step} delay={index * 250} blur={12} offsetY={20}><article className="scenario-card"><small>STEP {index + 1}</small><h4>{step}</h4><p>跟随引导，逐步完成团队设置。</p></article></BlurFade>)}
  </div>;
}

export function FadeInScenario() {
  const [saved, setSaved] = useState(false);
  return <div className="motion-demo"><button type="button" onClick={() => setSaved((value) => !value)}>{saved ? '继续编辑' : '保存偏好'}</button>
    {saved ? <FadeIn duration={900}><p role="status" className="scenario-card">✓ 偏好已保存，下次访问时生效。</p></FadeIn> : <p>修改完成后保存，查看确认反馈。</p>}
  </div>;
}

export function SlideInScenario() {
  const [open, setOpen] = useState(false);
  return <div className="motion-demo"><button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? '关闭通知' : '显示通知'}</button>
    {open && <SlideIn direction="right" distance={64} duration={500}><aside className="scenario-card"><h4>新的评审邀请</h4><p>团队邀请你参与首页设计评审。</p></aside></SlideIn>}
  </div>;
}

export function ScrollRevealScenario() {
  return <div className="reference-demo__scroll" tabIndex={0} aria-label="滚动查看项目里程碑">
    <p className="reference-demo__scroll-spacer">向下滚动，逐个揭示里程碑 ↓</p>
    {['需求确认', '设计验收', '交付上线'].map((step) => <ScrollReveal key={step} direction="left" distance={48} once={false} threshold={0.5}><article className="scenario-card"><h4>{step}</h4><p>关键节点已完成，项目继续向前。</p></article></ScrollReveal>)}
    <p className="reference-demo__scroll-spacer">向上滚动，重新查看里程碑 ↑</p>
  </div>;
}

export function ScaleInScenario() {
  const [open, setOpen] = useState(false);
  return <div className="motion-demo"><button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? '关闭快捷菜单' : '打开快捷菜单'}</button>
    {open && <ScaleIn startScale={0.65} duration={300}><nav className="scenario-card" aria-label="创建快捷入口"><a href="#stagger">查看入门步骤 →</a><a href="#animatedList">查看团队动态 →</a></nav></ScaleIn>}
  </div>;
}

export function StaggerScenario() {
  return <Stagger staggerDelay={220} duration={650} className="scenario-grid">
    {['01 创建空间', '02 配置品牌', '03 邀请团队'].map((step) => <article key={step} className="scenario-card"><h4>{step}</h4><p>从清晰的步骤开始协作。</p></article>)}
  </Stagger>;
}

export function ExpandScenario() {
  const [selected, setSelected] = useState<number | null>(0);
  return <div className="motion-demo">{['可以随时修改套餐吗？', '团队成员如何加入？'].map((question, index) => <div key={question} className="scenario-card">
    <button type="button" aria-expanded={selected === index} aria-controls={`scenario-faq-${index}`} onClick={() => setSelected((value) => value === index ? null : index)}>{question}</button>
    <Expand id={`scenario-faq-${index}`} open={selected === index}><p>{index === 0 ? '可以在工作区设置中随时调整，变更前会展示费用说明。' : '由管理员发送邀请链接，成员接受邀请后即可加入。'}</p></Expand>
  </div>)}</div>;
}

export function PulseScenario() {
  const [live, setLive] = useState(true);
  return <div className="motion-demo"><button type="button" aria-pressed={live} onClick={() => setLive((value) => !value)}>切换服务状态</button>
    <div className="scenario-card">{live ? <Pulse duration={2200}><strong>● 正在同步团队文件</strong></Pulse> : <strong>✓ 所有文件已同步</strong>}<p role="status">{live ? '同步进行中，请稍候。' : '当前没有待同步内容。'}</p></div>
  </div>;
}

export function GlowScenario() {
  return <Glow color="#2f9472" duration={2600}><article className="scenario-card"><small>系统状态</small><h4>所有服务运行正常</h4><p>绿色柔光突出健康状态。</p></article></Glow>;
}

export function ShakeScenario() {
  const [attempt, setAttempt] = useState(0);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  return <form className="motion-demo" onSubmit={(event) => { event.preventDefault(); setAttempt((value) => value + 1); setError(code !== '2026'); }}>
    <label>体验码（输入 2026 通过）<Shake key={attempt} active={error} duration={450}><input value={code} aria-invalid={error} aria-describedby="scenario-code-result" onChange={(event) => setCode(event.target.value)} /></Shake></label>
    <button type="submit">验证体验码</button><p id="scenario-code-result" role="status">{attempt === 0 ? '提交错误内容，观察输入框的抖动。' : error ? '体验码不正确，请重试。' : '验证成功，欢迎体验。'}</p>
  </form>;
}

export function WobbleScenario() {
  const [replay, setReplay] = useState(0);
  return <div className="motion-demo"><button type="button" onClick={() => setReplay((value) => value + 1)}>提醒我查看奖励</button>
    <Wobble key={replay} duration={1200}><article className="scenario-card"><h4>✦ 本周协作奖励</h4><p>完成 3 次评审，解锁团队新徽章。</p></article></Wobble>
  </div>;
}

export function HoverLiftScenario() {
  return <div className="scenario-grid">{[['入门指南', '#stagger'], ['交互反馈', '#press']].map(([title, href]) =>
    <HoverLift key={href} lift={10} duration={250}><a className="scenario-card" href={href}><h4>{title} ↗</h4><p>悬停卡片，探索更多组件。</p></a></HoverLift>)}
  </div>;
}

export function PressScenario() {
  const [selected, setSelected] = useState('月付');
  return <div className="motion-demo"><div className="reference-demo__actions">{['月付', '年付'].map((plan) =>
    <Press key={plan} duration={120}><button type="button" aria-pressed={selected === plan} onClick={() => setSelected(plan)}>{plan}{plan === '年付' ? ' · 节省 20%' : ''}</button></Press>)}
    </div><p role="status">当前选择：{selected}方案</p>
  </div>;
}

export function FlipInScenario() {
  return <div className="scenario-grid">{['需求确认', '方案通过', '交付完成'].map((step, index) =>
    <FlipIn key={step} direction="x" delay={index * 250} duration={800}><article className="scenario-card"><h4>✓ {step}</h4><p>围绕 X 轴翻转展示交付结果。</p></article></FlipIn>)}
  </div>;
}

export function FlipCardScenario() {
  const [answer, setAnswer] = useState(false);
  return <div className="motion-demo"><button type="button" aria-pressed={answer} onClick={() => setAnswer((value) => !value)}>{answer ? '返回问题' : '揭晓答案'}</button>
    <FlipCard direction="vertical" flipped={answer} style={{ width: '100%', maxWidth: 420, height: 200 }} aria-label="动画知识闪卡"
      front={<article className="scenario-card"><small>QUESTION</small><h4>何时使用减少动态效果？</h4><p>先想一想，再翻转查看答案。</p></article>}
      back={<article className="scenario-card"><small>ANSWER</small><h4>尊重用户的系统偏好</h4><p>减少非必要位移，让内容仍然清晰可用。</p></article>} />
  </div>;
}

export function ConfettiScenario() {
  const [completed, setCompleted] = useState(false);
  return <div className="motion-demo"><button type="button" onClick={() => setCompleted((value) => !value)}>{completed ? '重新开始挑战' : '完成本周挑战'}</button>
    <Confetti active={completed} count={32} colors={['#2f9472', '#e9b34d', '#685cf6']} duration={2200}><article className="scenario-card"><h4>{completed ? '✦ 新成就已解锁' : '本周协作挑战'}</h4><p role="status">{completed ? '连续完成 5 个任务，继续保持！' : '完成最后一步，领取成就徽章。'}</p></article></Confetti>
  </div>;
}

export function ShimmerScenario() {
  const [loading, setLoading] = useState(true);
  return <div className="motion-demo"><button type="button" onClick={() => setLoading((value) => !value)}>{loading ? '显示加载结果' : '模拟重新加载'}</button>
    <div aria-busy={loading}>{loading ? <Shimmer duration={1200} highlight="rgb(255 255 255 / 70%)"><div className="scenario-card scenario-skeleton"><span /><span /><span /></div></Shimmer> : <article className="scenario-card"><h4>团队周报已就绪</h4><p>本周已完成 12 项任务。</p></article>}</div><p role="status">{loading ? '正在加载周报…' : '周报加载完成。'}</p>
  </div>;
}

export function AnimatedListScenario() {
  const [filter, setFilter] = useState(false);
  const files = [{ id: 'guide', name: '品牌指南.pdf', recent: true }, { id: 'archive', name: '历史提案.fig', recent: false }, { id: 'cover', name: '封面草稿.png', recent: true }];
  return <div className="motion-demo"><button type="button" aria-pressed={filter} onClick={() => setFilter((value) => !value)}>{filter ? '显示全部文件' : '仅看最近更新'}</button>
    <AnimatedList items={files.filter((file) => !filter || file.recent)} getItemKey={(file) => file.id} staggerDelay={200} renderItem={(file) => <article className="scenario-card"><strong>{file.name}</strong><small>{file.recent ? '今天更新' : '上月更新'}</small></article>} />
  </div>;
}

export function TransitionScenario() {
  const [visible, setVisible] = useState(true);
  return <div className="motion-demo"><button type="button" onClick={() => setVisible((value) => !value)}>{visible ? '关闭保存提醒' : '显示保存提醒'}</button>
    <Transition in={visible} appear animation="slide-up" timeout={500}><p className="scenario-card" role="status">✓ 草稿已自动保存，可以继续编辑。</p></Transition>
  </div>;
}

export function TransitionGroupScenario() {
  const [messages, setMessages] = useState([{ id: 1, text: '新评论：这个版本很清晰。' }]);
  const [nextId, setNextId] = useState(2);
  return <div className="motion-demo"><button type="button" disabled={messages.length >= 4} onClick={() => { setMessages((items) => [...items, { id: nextId, text: `通知 ${nextId}：团队刚刚更新了项目。` }]); setNextId((value) => value + 1); }}>接收新通知（最多 4 条）</button>
    <TransitionGroup>{messages.map((message) => <Transition key={message.id} appear animation="fade" timeout={450} exit={<p className="scenario-card">通知已读</p>}><div className="scenario-card"><p>{message.text}</p><button type="button" onClick={() => setMessages((items) => items.filter((item) => item.id !== message.id))}>标为已读</button></div></Transition>)}</TransitionGroup>
    {messages.length === 0 && <p role="status">所有通知已读。</p>}
  </div>;
}

export function BorderBeamScenario() {
  const [active, setActive] = useState(true);
  return <div className="motion-demo"><button type="button" aria-pressed={active} onClick={() => setActive((value) => !value)}>{active ? '暂停推荐强调' : '开启推荐强调'}</button>
    <BorderBeam color="#e9b34d" duration={6} paused={!active} className="scenario-card"><small>RECOMMENDED</small><h4>团队年度方案</h4><p>为长期协作提供更充足的空间。</p><a href="#progressRing">了解团队目标 →</a></BorderBeam>
  </div>;
}

export function AutoSizeScenario() {
  const [company, setCompany] = useState(false);
  return <div className="motion-demo"><label><input type="checkbox" checked={company} onChange={(event) => setCompany(event.target.checked)} /> 开具企业发票</label>
    <AutoSize duration={400}><div className="scenario-card"><label>收件邮箱<input type="email" placeholder="name@example.com" /></label>{company && <><label>企业名称<input placeholder="请输入完整企业名称" /></label><label>纳税人识别号<input placeholder="请输入识别号" /></label></>}</div></AutoSize>
  </div>;
}

export function LayoutListScenario() {
  const [ascending, setAscending] = useState(false);
  const scores = [{ id: 'lin', name: '林 · 980 分', score: 980 }, { id: 'chen', name: '陈 · 860 分', score: 860 }, { id: 'zhou', name: '周 · 920 分', score: 920 }];
  return <div className="motion-demo"><button type="button" onClick={() => setAscending((value) => !value)}>{ascending ? '按得分降序' : '按得分升序'}</button>
    <LayoutList items={[...scores].sort((a, b) => ascending ? a.score - b.score : b.score - a.score)} getItemKey={(member) => member.id} duration={600} renderItem={(member, index) => <div className="scenario-card"><strong>#{index + 1} {member.name}</strong></div>} />
  </div>;
}

export function RippleScenario() {
  const [saved, setSaved] = useState(false);
  return <div className="motion-demo"><Ripple color="#2f9472" duration={850}><button type="button" aria-pressed={saved} onClick={() => setSaved((value) => !value)}>{saved ? '★ 已收藏文章' : '☆ 收藏文章'}</button></Ripple>
    <p role="status">{saved ? '文章已加入收藏夹。' : '点击任意位置，或使用 Enter / Space 收藏。'}</p>
  </div>;
}

export function TextRotateScenario() {
  const [step, setStep] = useState(0);
  const words = ['第一步：创建你的工作区', '第二步：邀请团队成员', '第三步：开始第一个项目'];
  return <div className="motion-demo"><TextRotate words={words} index={step} animation="fade" aria-live="polite" duration={600} />
    <div className="reference-demo__actions"><button type="button" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>上一步</button><button type="button" disabled={step === words.length - 1} onClick={() => setStep((value) => value + 1)}>下一步</button></div><p>当前步骤 {step + 1} / {words.length}</p>
  </div>;
}

export function ScrollProgressScenario() {
  const containerRef = useRef<HTMLDivElement>(null);
  return <div className="motion-demo"><div style={{ position: 'relative', overflow: 'hidden' }}>
    <div ref={containerRef} className="motion-demo__scroll" tabIndex={0} aria-label="入门手册">{['创建工作区', '邀请团队成员', '设置项目目标', '组织设计资源', '完成第一次交付', '回顾协作成果'].map((chapter, index) => <section key={chapter}><h4>{index + 1}. {chapter}</h4><p>按照指南逐步配置，向下滚动查看后续章节。</p></section>)}</div>
    <ScrollProgress containerRef={containerRef} position="bottom" height={6} color="#2f9472" aria-label="入门手册阅读进度" /></div><button type="button" onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}>从头阅读</button>
  </div>;
}

export function TiltScenario() {
  const [enabled, setEnabled] = useState(true);
  return <div className="motion-demo"><label><input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} /> 开启会员卡倾斜</label>
    <Tilt maxAngle={16} perspective={600} disabled={!enabled}><article className="scenario-card scenario-membership"><small>ATELIER CLUB</small><h4>年度创作者会员</h4><p>MEMBER 0086 · 移动指针探索卡面</p></article></Tilt>
  </div>;
}

export function SpotlightScenario() {
  return <Spotlight color="rgb(233 179 77 / 35%)" radius={100}><article className="scenario-card scenario-membership"><small>本周精选</small><h4>探索创意灵感库</h4><p>移动指针，用聚光灯发现内容细节。</p><a href="#gradientText">发现更多灵感 →</a></article></Spotlight>;
}

export function ProgressRingScenario() {
  const [done, setDone] = useState(2);
  return <div className="motion-demo"><div className="reference-demo__actions"><button type="button" disabled={done === 5} onClick={() => setDone((value) => value + 1)}>完成一项任务</button><button type="button" onClick={() => setDone(0)}>重置目标</button></div>
    <div className="scenario-card"><h4>每周协作目标</h4><ProgressRing value={done / 5 * 100} size={120} strokeWidth={10} color="#2f9472" aria-label="每周任务完成进度"><strong>{done} / 5</strong></ProgressRing><p role="status">{done === 5 ? '本周目标已达成！' : `还有 ${5 - done} 项任务待完成。`}</p></div>
  </div>;
}

export function ParallaxScenario() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(true);
  return <div className="motion-demo"><label><input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} /> 开启故事视差</label>
    <div ref={containerRef} className="reference-demo__scroll" tabIndex={0} aria-label="滚动浏览创作故事"><p className="reference-demo__scroll-spacer">向下滚动，进入创作故事 ↓</p><Parallax containerRef={containerRef} distance={80} disabled={!enabled}><article className="scenario-card"><small>CHAPTER 01</small><h4>每个灵感，都值得被记录</h4><p>文字随滚动产生轻微位移，可关闭效果进行对比。</p></article></Parallax><div className="reference-demo__scroll-spacer">故事仍在继续 ↓</div></div>
  </div>;
}

export function GradientTextScenario() {
  const [animate, setAnimate] = useState(false);
  return <div className="motion-demo"><label><input type="checkbox" checked={animate} onChange={(event) => setAnimate(event.target.checked)} /> 开启渐变流动</label>
    <article className="scenario-card"><small>SPRING COLLECTION</small><h3><GradientText colors={['#2f9472', '#d59432', '#2f9472']} animate={animate} duration={2400}>让自然灵感融入日常</GradientText></h3><p>活动标题可保持静态，也可开启流动渐变。</p></article>
  </div>;
}

export function ImageRevealScenario() {
  return <div className="scenario-grid">{(['left', 'right'] as const).map((direction, index) => <ImageReveal key={direction} direction={direction} delay={index * 300} duration={1100}>
    <figure className="scenario-card"><svg viewBox="0 0 320 180" role="img" aria-label={index === 0 ? '暖色日落与山丘插画' : '冷色夜空与山丘插画'}><rect width="320" height="180" fill={index === 0 ? '#f6c9a8' : '#394b74'} /><circle cx="240" cy="55" r="28" fill="#ffdfad" /><path d="M0 180V130L85 45L190 150L265 90L320 135V180Z" fill={index === 0 ? '#a16664' : '#7189a3'} /></svg><figcaption>{index === 0 ? '日落系列 · 从左揭示' : '夜色系列 · 从右揭示'}</figcaption></figure>
  </ImageReveal>)}</div>;
}
