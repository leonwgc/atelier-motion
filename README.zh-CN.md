# Atelier Motion

[English](./README.md) | 简体中文

从 `atelier-ui` 抽离的独立 React 动画组件库，包含 35 个组件和可独立部署的 demo。保持原组件 API 与 `at-` 样式前缀，不依赖 `atelier-ui`，也不引入额外动画运行时。

## 开发

需要 Node.js >= 20.19.0，使用 npm。

```sh
npm ci
npm run dev
```

打开 <http://localhost:4100>。Demo 包含全局组件搜索（⌘/Ctrl + K）、独立组件页面、每个组件至少 2 个用例场景、独立动画重播、完整 TSX 示例和 API 表格；通过 URL hash 可直接访问组件，例如 `/#fadeIn`。

```sh
npm run typecheck
npm run build        # 库输出到 dist/，demo 输出到 docs/
npm run preview     # 预览构建后的 demo
```

`docs/` 使用相对资源路径，可部署到静态托管服务的根目录或子目录。`dist/` 与 `docs/` 独立生成，npm 包仅包含库和 README。

## 安装与使用

发布后安装：

```sh
npm install atelier-motion
```

React / React DOM 18 为 peer dependencies。支持 ESM、CommonJS 和 TypeScript 类型声明。

```tsx
import { FadeIn } from 'atelier-motion/fade-in';

export function Welcome() {
  return (
    <FadeIn duration={600} delay={100}>
      <h1>Hello, motion.</h1>
    </FadeIn>
  );
}
```

也可以从总入口导入：

```tsx
import { FadeIn, SlideIn, Transition, TransitionGroup } from 'atelier-motion';
```

ESM 入口自动引入对应 CSS，需要由支持 CSS 导入的打包器处理（例如 Vite）。推荐按组件导入，避免带入无关组件样式。CommonJS 在浏览器打包环境加载样式，在 Node.js 中跳过 CSS 加载，可用于服务端渲染；SSR 页面仍需在客户端入口引入组件样式。

```tsx
import 'atelier-motion/theme.css';
import 'atelier-motion/styles/fade-in.css'; // 对应 dist/fade-in.css
```

保留 `--at-*` 主题变量，可覆盖颜色、圆角和缓动曲线。主题仅声明变量，不覆盖宿主页面的字体、表单元素或全局交互样式。组件遵循 `prefers-reduced-motion`。

## 组件目录

| 组件 | 按需入口 | 用途 |
| --- | --- | --- |
| ProgressRing | `atelier-motion/progress-ring` | 确定进度的环形展示 |
| Parallax | `atelier-motion/parallax` | 页面或容器滚动视差 |
| GradientText | `atelier-motion/gradient-text` | 营销标题流动渐变 |
| ImageReveal | `atelier-motion/image-reveal` | 图片进入视口时方向揭示 |
| ScrollProgress | `atelier-motion/scroll-progress` | 页面或容器阅读进度 |
| Tilt | `atelier-motion/tilt` | 指针倾斜反馈 |
| Spotlight | `atelier-motion/spotlight` | 指针跟随光效 |
| AutoSize | `atelier-motion/auto-size` | 内容变化时平滑调整高度 |
| LayoutList | `atelier-motion/layout-list` | 纵向列表排序与增删位置动画 |
| Ripple | `atelier-motion/ripple` | 点击位置或键盘中心涟漪 |
| TextRotate | `atelier-motion/text-rotate` | 自动或受控的整句文案轮换 |
| AnimatedList | `atelier-motion/animated-list` | 列表交错渐入 |
| BlurFade | `atelier-motion/blur-fade` | 模糊渐入 |
| BorderBeam | `atelier-motion/border-beam` | 边框流光 |
| Confetti | `atelier-motion/confetti` | 庆祝粒子 |
| Expand | `atelier-motion/expand` | 受控展开与收起 |
| FadeIn | `atelier-motion/fade-in` | 透明度淡入 |
| FlipCard | `atelier-motion/flip-card` | 受控正反面翻转 |
| FlipIn | `atelier-motion/flip-in` | 翻转进入 |
| Glow | `atelier-motion/glow` | 循环柔光 |
| HoverLift | `atelier-motion/hover-lift` | 悬停抬升 |
| Marquee | `atelier-motion/marquee` | 连续滚动 |
| NumberTicker | `atelier-motion/number-ticker` | 数值滚动 |
| Press | `atelier-motion/press` | 按压反馈 |
| Pulse | `atelier-motion/pulse` | 呼吸效果 |
| ScaleIn | `atelier-motion/scale-in` | 缩放进入 |
| ScrollReveal | `atelier-motion/scroll-reveal` | 进入视口时显现 |
| Shake | `atelier-motion/shake` | 水平抖动反馈 |
| Shimmer | `atelier-motion/shimmer` | 表面掠光 |
| SlideIn | `atelier-motion/slide-in` | 方向滑入 |
| Stagger | `atelier-motion/stagger` | 子项错峰渐入 |
| Transition | `atelier-motion/transition` | 进入、退出生命周期 |
| TransitionGroup | `atelier-motion/transition-group` | 按稳定 key 管理动态项 |
| TypingAnimation | `atelier-motion/typing-animation` | 逐字输入 |
| Wobble | `atelier-motion/wobble` | 摇摆反馈 |

大多数组件时间单位为毫秒；`Marquee.duration` 和 `BorderBeam.duration` 为秒。具体参数与默认值见 demo 的 API 表格和导出的 Props 类型。

`TransitionGroup` 直接接收带稳定 key 的 `Transition` 元素。删除业务数据时立即更新 state；可通过 `Transition.exit` 提供不含可交互表单的退场快照。`Expand`、`FlipCard` 的状态由调用方控制。

## 独立发布

```sh
npm run typecheck
npm run build
npm pack --dry-run
npm pack
```

打包前的 `prepack` 会自动检查类型并构建库。可以先在消费项目中安装生成的 `atelier-motion-0.1.0.tgz` 验证。

准备公开发布时，先确认 npm 包名可用、版本号、账号权限以及源代码的发布许可，再执行：

```sh
npm login
npm publish --access public
```

项目配置已允许公开发布。此仓库初始化不包含远程发布或 demo 部署操作。

## 迁移

原组件调用方式不变，将导入包名从 `atelier-ui` 换为 `atelier-motion` 即可。原始 `atelier-ui` 仓库在本次抽离中未修改，现有消费者可逐步迁移。

## 内容与布局动画

- `AutoSize` 用 `ResizeObserver` 测量内部自然高度，包括异步内容和换行变化。不要给外层设置固定高度，内容的留白应放在子元素中。不支持该 API 的环境保留自然高度。
- `LayoutList` 通过 `getItemKey` 识别唯一、稳定的列表项，平滑移动纵向列表中的保留项。新增项立即显示，删除项立即移除；不包含拖拽、网格或退场保留。动画由组件管理列表项的 transform，请把自定义变换放在子元素上。不支持 Web Animations API 时直接更新布局。
- `Ripple` 只接受一个原生 `button` 或 `a`，保留原元素的 ref、事件与属性。使用常规 children 内容，不支持 dangerouslySetInnerHTML。原生禁用、aria-disabled、主动关闭或减少动态效果时不播放涟漪；`Ripple.disabled` 只关闭效果，不禁用链接导航或按钮操作。调用方阻止默认事件时不播放涟漪。
- `TextRotate` 默认每 2400ms 自动切换整句文案，可用 `paused`、`autoPlay` 控制；悬停与焦点暂停可避免干扰阅读。传入 `index` 后改为外部驱动，自动计时停止，`onIndexChange` 仅报告内部自动切换。索引循环归一化，空数组显示空内容，单条文案不创建计时器。辅助技术只读取当前文案，默认不主动播报；减少动态效果时保持切换并去除动画。

四个组件的 `duration` 与 `TextRotate.interval` 单位均为毫秒。无效时长回退到默认值，负时长视为零；`interval` 最小为 100ms。

## 自动化测试

首次安装后，下载与锁定版本匹配的测试浏览器：

```sh
npm ci
npx playwright install chromium firefox webkit
# Linux CI 可改用：npx playwright install --with-deps chromium firefox webkit
```

```sh
npm test                 # 单元、组件、demo 和 SSR 测试
npm run test:watch       # Vitest 监听模式
npm run test:coverage    # 单元测试及组件源码覆盖率门槛
npm run typecheck:tests  # 检查组件、demo、所有测试和测试配置的类型
npm run test:e2e         # 真实浏览器端到端测试
npm run test:all         # 类型检查 → 覆盖率 → 端到端测试
```

### 测试范围

| 测试文件 | 验证内容 |
| --- | --- |
| `tests/behavior.test.tsx` | 受控状态、计时器、过渡回调、格式化、边界值、列表身份、ref 和事件保留 |
| `tests/browser-apis.test.tsx` | 观察器回调与清理、滚动进度、指针移动与复位、减少动态效果、动画计时 |
| `tests/edge-cases.test.tsx` | 连续重排位移与旧动画取消、删除清理、退场中重新加入、动态参数、涟漪坐标与禁用组合 |
| `tests/demo.test.tsx` | 全部 35 个组件的双场景、代码展示、独立重播，以及 FAQ、输入校验、进度交互 |
| `tests/ssr.test.tsx` | Node 环境无浏览器 API 时，代表性组件的服务端渲染 |
| `tests/e2e/motion.spec.ts` | 全组件页面与横向溢出、键盘涟漪、真实列表位移、表单高度、滚动进度与视差、折叠焦点与 inert |

单元测试使用 Vitest、React Testing Library 和 jsdom；按需模拟浏览器 API，测试结束后恢复。SSR 测试单独运行在 Node 环境。端到端测试使用 Playwright，在 Chromium 桌面、Chromium 移动端模拟、Firefox 和 WebKit 四个项目运行。

Playwright 自动启动独立的 `127.0.0.1:4178` 服务，要求该端口空闲；不复用日常开发的 4100 端口。只运行单个浏览器可用 `npm run test:e2e -- --project=chromium`。

### 最近验证结果

2026-11-02 本地验证：

- 5 个 Vitest 测试文件，91 项单元、组件、demo 和 SSR 测试全部通过。
- 6 个端到端场景 × 4 个浏览器项目，共 24 项全部通过；其中全组件巡检场景会逐一访问 35 个组件页面。
- `npm run typecheck:tests` 通过。
- 组件源码覆盖率：语句 97.16%、分支 87.81%、函数 96.18%、行 98.81%。

这些数字是本次执行快照，后续修改以重新运行生成的报告为准。

### 覆盖率与报告

组件源码覆盖率门槛为语句 90%、分支 80%、函数 90%、行 95%。覆盖率不包含 demo、测试代码和仅重新导出的组件入口；端到端测试不计入该百分比。

- 单元覆盖率报告：`coverage/index.html`。
- 浏览器测试报告：`playwright-report/index.html`，可用 `npx playwright show-report` 打开。
- 浏览器失败时保留截图和 trace，输出在 `test-results/`，可通过 HTML 报告查看。
- 生成的报告均已加入 `.gitignore`。

测试验证明确的状态、几何位置、动画执行和键盘行为；不等同于逐像素视觉回归、全部辅助技术兼容性或真实移动设备验证。SSR 当前覆盖代表性组件，并非全部导出组件的 hydration 矩阵。
