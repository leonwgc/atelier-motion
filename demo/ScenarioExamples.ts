import type { ComponentType } from 'react';
import type { AnimationPageId } from './AnimationPages';
import * as demos from './ScenarioDemos';
import scenarioSource from './ScenarioDemos.tsx?raw';

export interface ScenarioExample {
  title: string;
  description: string;
  preview: ComponentType;
  code: string;
}

// 展示代码直接来自运行中的 demo，避免示例与实际交互分别维护。
function example(name: string, title: string, description: string, preview: ComponentType): ScenarioExample {
  const start = scenarioSource.indexOf(`export function ${name}()`);
  if (start < 0) throw new Error(`未找到场景源码：${name}`);
  const next = scenarioSource.indexOf('\nexport function ', start + 1);
  const body = scenarioSource.slice(start, next < 0 ? undefined : next).trim();
  const hooks = ['useRef', 'useState'].filter((hook) => body.includes(`${hook}(`) || body.includes(`${hook}<`));
  const components = Object.keys(scenarioComponents).filter((component) => new RegExp(`\\b${component}\\b`).test(body));
  const imports = [
    ...(hooks.length ? [`import { ${hooks.join(', ')} } from 'react';`] : []),
    ...components.map((component) => `import { ${component} } from 'atelier-motion/${scenarioComponents[component]}';`),
  ];
  return { title, description, preview, code: `${imports.join('\n')}\n\n${body}` };
}

const scenarioComponents: Record<string, string> = {
  Marquee: 'marquee',
  NumberTicker: 'number-ticker',
  TypingAnimation: 'typing-animation',
  BlurFade: 'blur-fade',
  FadeIn: 'fade-in',
  SlideIn: 'slide-in',
  ScrollReveal: 'scroll-reveal',
  ScaleIn: 'scale-in',
  Stagger: 'stagger',
  Expand: 'expand',
  Pulse: 'pulse',
  Glow: 'glow',
  Shake: 'shake',
  Wobble: 'wobble',
  HoverLift: 'hover-lift',
  Press: 'press',
  FlipIn: 'flip-in',
  FlipCard: 'flip-card',
  Confetti: 'confetti',
  Shimmer: 'shimmer',
  AnimatedList: 'animated-list',
  Transition: 'transition',
  TransitionGroup: 'transition-group',
  BorderBeam: 'border-beam',
  AutoSize: 'auto-size',
  LayoutList: 'layout-list',
  Ripple: 'ripple',
  TextRotate: 'text-rotate',
  ScrollProgress: 'scroll-progress',
  Tilt: 'tilt',
  Spotlight: 'spotlight',
  ProgressRing: 'progress-ring',
  Parallax: 'parallax',
  GradientText: 'gradient-text',
  ImageReveal: 'image-reveal',
};

export const scenarioExamples = {
  marquee: example('MarqueeScenario', '客户评价墙', '向右慢速滚动评价内容，悬停暂停阅读。', demos.MarqueeScenario),
  numberTicker: example('NumberTickerScenario', '目标完成率', '拖动滑块，观察带一位小数和百分号的数值过渡。', demos.NumberTickerScenario),
  typingAnimation: example('TypingAnimationScenario', '初始化结果', '单条提示逐字显示，完成后停止且隐藏光标。', demos.TypingAnimationScenario),
  blurFade: example('BlurFadeScenario', '新用户引导', '三张引导卡片依次从模糊状态显现。', demos.BlurFadeScenario),
  fadeIn: example('FadeInScenario', '保存确认反馈', '保存偏好后淡入确认信息，继续编辑可重新体验。', demos.FadeInScenario),
  slideIn: example('SlideInScenario', '评审通知', '点击显示通知，查看内容从右侧滑入。', demos.SlideInScenario),
  scrollReveal: example('ScrollRevealScenario', '项目里程碑', '滚动容器，观察多个节点从左侧反复显现。', demos.ScrollRevealScenario),
  scaleIn: example('ScaleInScenario', '创建快捷入口', '打开导航菜单，观察较小起始比例的缩放进入。', demos.ScaleInScenario),
  stagger: example('StaggerScenario', '工作区设置步骤', '用较长的错峰间隔依次展示完整步骤卡片。', demos.StaggerScenario),
  expand: example('ExpandScenario', '常见问题手风琴', '展开问题查看回答，同一时间仅保留一个回答展开。', demos.ExpandScenario),
  pulse: example('PulseScenario', '文件同步状态', '切换同步与完成状态，观察呼吸强调的启停。', demos.PulseScenario),
  glow: example('GlowScenario', '服务健康状态', '使用绿色慢速柔光强调正常运行的服务。', demos.GlowScenario),
  shake: example('ShakeScenario', '体验码校验', '提交错误体验码触发输入框抖动，输入 2026 可通过校验。', demos.ShakeScenario),
  wobble: example('WobbleScenario', '奖励提醒', '点击提醒按钮，重新播放成就卡片的摇摆效果。', demos.WobbleScenario),
  hoverLift: example('HoverLiftScenario', '资源导航卡片', '悬停不同导航入口，体验更明显的抬升反馈。', demos.HoverLiftScenario),
  press: example('PressScenario', '付费周期选择', '按压并选择月付或年付方案，查看选择结果。', demos.PressScenario),
  flipIn: example('FlipInScenario', '交付结果展示', '围绕 X 轴错峰翻转，呈现三个交付节点。', demos.FlipInScenario),
  flipCard: example('FlipCardScenario', '知识学习闪卡', '通过按钮绕垂直方向翻转，切换问题与答案。', demos.FlipCardScenario),
  confetti: example('ConfettiScenario', '挑战成就解锁', '完成挑战后才播放粒子效果，可重置后再次解锁。', demos.ConfettiScenario),
  shimmer: example('ShimmerScenario', '周报加载占位', '切换模拟加载状态，对比流光占位和真实内容。', demos.ShimmerScenario),
  animatedList: example('AnimatedListScenario', '最近文件筛选', '切换全部与最近更新，观察文件列表的渐入。', demos.AnimatedListScenario),
  transition: example('TransitionScenario', '自动保存提醒', '切换提醒显隐，体验 slide-up 的进入和退出。', demos.TransitionScenario),
  transitionGroup: example('TransitionGroupScenario', '通知收件箱', '接收和标记已读通知，观察独立项淡入淡出。', demos.TransitionGroupScenario),
  borderBeam: example('BorderBeamScenario', '推荐套餐强调', '用金色慢速边框流光强调套餐，可暂停或继续。', demos.BorderBeamScenario),
  autoSize: example('AutoSizeScenario', '企业发票表单', '勾选企业发票，容器随额外字段平滑调整高度。', demos.AutoSizeScenario),
  layoutList: example('LayoutListScenario', '积分排行榜', '切换得分排序，观察稳定 key 对应的成员位置变化。', demos.LayoutListScenario),
  ripple: example('RippleScenario', '文章收藏', '点击或通过键盘收藏文章，体验绿色慢速涟漪。', demos.RippleScenario),
  textRotate: example('TextRotateScenario', '分步操作指引', '使用上一步和下一步，驱动受控文案淡入切换。', demos.TextRotateScenario),
  scrollProgress: example('ScrollProgressScenario', '手册底部进度', '阅读独立手册容器，在底部查看加粗绿色进度条。', demos.ScrollProgressScenario),
  tilt: example('TiltScenario', '创作者会员卡', '移动指针体验较大倾斜角度，可关闭效果对比。', demos.TiltScenario),
  spotlight: example('SpotlightScenario', '精选灵感卡片', '用较小的暖色光斑突出指针附近的内容。', demos.SpotlightScenario),
  progressRing: example('ProgressRingScenario', '每周任务目标', '完成任务驱动圆环，用自定义圆心显示完成项数。', demos.ProgressRingScenario),
  parallax: example('ParallaxScenario', '创作故事阅读', '滚动故事并切换视差开关，对比内容的位置变化。', demos.ParallaxScenario),
  gradientText: example('GradientTextScenario', '自然主题活动标题', '对比绿色与金色搭配的静态渐变和流动渐变。', demos.GradientTextScenario),
  imageReveal: example('ImageRevealScenario', '插画作品双列展示', '本地 SVG 插画从左右两侧错峰揭示，无需远程图片。', demos.ImageRevealScenario),
} satisfies Record<AnimationPageId, ScenarioExample>;
