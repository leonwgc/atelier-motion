import { useState } from 'react';
import { AutoSize } from 'atelier-motion/auto-size';
import { LayoutList } from 'atelier-motion/layout-list';
import { Ripple } from 'atelier-motion/ripple';
import { TextRotate } from 'atelier-motion/text-rotate';
import { ScrollProgress } from 'atelier-motion/scroll-progress';
import { Tilt } from 'atelier-motion/tilt';
import { Spotlight } from 'atelier-motion/spotlight';
import { useRef } from 'react';
import type { AnimationPageMeta } from './AnimationPages';

function AutoSizeDemo() {
  const [lines, setLines] = useState(1);
  return <div className="motion-demo">
    <div className="motion-demo__actions">
      <button type="button" onClick={() => setLines((value) => Math.min(6, value + 1))} disabled={lines === 6}>添加一段内容</button>
      <button type="button" onClick={() => setLines((value) => Math.max(0, value - 1))} disabled={lines === 0}>移除一段内容</button>
    </div>
    <AutoSize className="motion-demo__surface">
      <div className="motion-demo__content">
        {Array.from({ length: lines }, (_, index) => <p key={index}>内容段落 {index + 1}：文字、表单校验信息或异步结果发生变化时，容器会平滑调整高度。</p>)}
        {lines === 0 && <p>暂无内容，仍然保留自然布局。</p>}
      </div>
    </AutoSize>
    <p className="motion-demo__note">也会响应容器宽度变化导致的文字换行。</p>
  </div>;
}

const initialTasks = [{ id: 1, title: '整理需求', done: true }, { id: 2, title: '完成设计', done: false }, { id: 3, title: '发布版本', done: false }];

function LayoutListDemo() {
  const [tasks, setTasks] = useState(initialTasks);
  const [hideDone, setHideDone] = useState(false);
  const [nextId, setNextId] = useState(4);
  return <div className="motion-demo">
    <div className="motion-demo__actions">
      <button type="button" onClick={() => setTasks((items) => [...items].reverse())}>反转顺序</button>
      <button type="button" aria-pressed={hideDone} onClick={() => setHideDone((value) => !value)}>{hideDone ? '显示已完成' : '隐藏已完成'}</button>
      <button type="button" onClick={() => { setTasks((items) => [{ id: nextId, title: `新任务 ${nextId}`, done: false }, ...items]); setNextId((id) => id + 1); }}>在顶部添加</button>
    </div>
    <LayoutList aria-label="任务列表" items={tasks.filter((task) => !hideDone || !task.done)} getItemKey={(task) => task.id} renderItem={(task) => <div className="motion-demo__row">
      <span>{task.done ? '✓ ' : '○ '}{task.title}</span>
      <button type="button" aria-label={`移除${task.title}`} onClick={() => setTasks((items) => items.filter((item) => item.id !== task.id))}>移除</button>
    </div>} />
    {tasks.length === 0 && <p role="status">暂无任务，可以在顶部添加。</p>}
    <p className="motion-demo__note">稳定的 key 保留各项身份；增删时，其余列表项平滑移动到新位置。</p>
  </div>;
}

function RippleDemo() {
  const [count, setCount] = useState(0);
  return <div className="motion-demo">
    <div className="motion-demo__actions">
      <Ripple color="#685cf6"><button type="button" onClick={() => setCount((value) => value + 1)}>点击或用键盘激活</button></Ripple>
      <Ripple><a className="motion-demo__link" href="#ripple">带涟漪的链接</a></Ripple>
      <Ripple><button type="button" disabled>禁用按钮</button></Ripple>
    </div>
    <p>已激活 {count} 次</p>
    <p className="motion-demo__note">点击从按下位置扩散，键盘激活从中心扩散；按钮仍可通过 Tab 聚焦、Space / Enter 激活。</p>
  </div>;
}

function TextRotateDemo() {
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = useState(0);
  const [animation, setAnimation] = useState<'fade' | 'slide-up'>('slide-up');
  const words = ['Build with clarity', 'Ship with confidence', 'Made to move'];
  return <div className="motion-demo">
    <div className="motion-demo__actions">
      <button type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? '继续轮播' : '暂停轮播'}</button>
      <label>切换效果 <select value={animation} onChange={(event) => setAnimation(event.target.value === 'fade' ? 'fade' : 'slide-up')}><option value="slide-up">向上滑动</option><option value="fade">淡入</option></select></label>
    </div>
    <div className="motion-demo__text"><TextRotate words={words} paused={paused} animation={animation} /></div>
    <div className="motion-demo__actions"><button type="button" onClick={() => setIndex((value) => (value + 1) % words.length)}>切换受控文案</button><TextRotate words={words} index={index} animation={animation} /></div>
    <p className="motion-demo__note">自动模式悬停时暂停；受控模式由 index 决定当前文案。减少动态效果时直接切换。</p>
  </div>;
}

function ScrollProgressDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  return <div className="motion-demo"><ScrollProgress containerRef={containerRef} aria-label="示例阅读进度" /><div ref={containerRef} className="motion-demo__scroll" tabIndex={0} aria-label="可滚动示例内容">{Array.from({ length: 12 }, (_, index) => <p key={index}>阅读内容 {index + 1}：向下滚动查看进度。</p>)}</div></div>;
}

export const newAnimationPages: AnimationPageMeta[] = [
  {
    id: 'scrollProgress', title: 'ScrollProgress 阅读进度', icon: '▰', description: '跟随页面或指定容器滚动，显示连续阅读进度。', preview: <ScrollProgressDemo />,
    code: `import { useRef } from 'react';
import { ScrollProgress } from 'atelier-motion/scroll-progress';

export function ReadingPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  return <div>
    <ScrollProgress containerRef={containerRef} aria-label="阅读进度" />
    <div ref={containerRef} style={{ height: 200, overflowY: 'auto' }}>
      <p>第一段内容</p><p>第二段内容</p><p>第三段内容</p>
    </div>
  </div>;
}`,
    rows: [['containerRef', 'RefObject<HTMLElement>', 'window'], ['position', "'top' | 'bottom'", 'top'], ['color', 'string', '主题主色'], ['height', 'number', '3 px'], ['aria-label', 'string', 'Scroll progress']],
  },
  {
    id: 'tilt', title: 'Tilt 指针倾斜', icon: '◇', description: '卡片随指针位置轻微倾斜，离开后复位。', preview: <Tilt className="motion-demo__feature"><strong>Move your pointer</strong><p>光标经过卡片时观察角度变化。</p></Tilt>,
    code: `import { Tilt } from 'atelier-motion/tilt';

export function FeatureCard() {
  return <Tilt maxAngle={8} perspective={800}>
    <article><h2>Explore the details</h2><p>Move your pointer over this card.</p></article>
  </Tilt>;
}`,
    rows: [['children', 'ReactNode', 'required'], ['maxAngle', 'number', '8°'], ['perspective', 'number', '800 px'], ['disabled', 'boolean', 'false']],
  },
  {
    id: 'spotlight', title: 'Spotlight 指针光效', icon: '✺', description: '柔和光斑跟随指针位置，突出卡片内容。', preview: <Spotlight className="motion-demo__feature"><strong>Follow the light</strong><p>光斑始终跟随指针。</p></Spotlight>,
    code: `import { Spotlight } from 'atelier-motion/spotlight';

export function HighlightCard() {
  return <Spotlight color="rgb(104 92 246 / 18%)" radius={180}>
    <article><h2>Featured</h2><p>Follow the light.</p></article>
  </Spotlight>;
}`,
    rows: [['children', 'ReactNode', 'required'], ['color', 'string', '半透明主色'], ['radius', 'number', '180 px'], ['disabled', 'boolean', 'false']],
  },
  {
    id: 'autoSize', title: 'AutoSize 自动高度', icon: '↕',
    description: '内容高度改变时平滑调整容器尺寸，适合异步结果和动态表单；不控制内容显隐。',
    preview: <AutoSizeDemo />,
    code: `import { useState } from 'react';
import { AutoSize } from 'atelier-motion/auto-size';

export function DynamicDetails() {
  const [count, setCount] = useState(1);

  return (
    <div>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        添加内容
      </button>
      <AutoSize duration={250}>
        {Array.from({ length: count }, (_, index) => (
          <p key={index}>内容段落 {index + 1}</p>
        ))}
      </AutoSize>
    </div>
  );
}`,
    rows: [['children', 'ReactNode', 'required'], ['duration', 'number', '250 ms'], ['HTML attributes', 'HTMLAttributes<HTMLDivElement>', '—'], ['height', '由内容测量决定；不要通过 style 固定高度', 'auto（SSR / 无 ResizeObserver 时）']],
  },
  {
    id: 'layoutList', title: 'LayoutList 列表布局过渡', icon: '⇅',
    description: '纵向列表排序、筛选或增删时，让保留项平滑移动到新位置。',
    preview: <LayoutListDemo />,
    code: `import { useState } from 'react';
import { LayoutList } from 'atelier-motion/layout-list';

export function TaskList() {
  const [tasks, setTasks] = useState([
    { id: 'design', title: '完成设计' },
    { id: 'release', title: '发布版本' },
  ]);

  return (
    <div>
      <button type="button" onClick={() => setTasks((items) => [...items].reverse())}>
        反转顺序
      </button>
      <LayoutList
        items={tasks}
        getItemKey={(task) => task.id}
        duration={250}
        renderItem={(task) => (
          <div>
            <span>{task.title}</span>
            <button
              type="button"
              aria-label={\`移除\${task.title}\`}
              onClick={() => setTasks((items) => items.filter((item) => item.id !== task.id))}
            >
              移除
            </button>
          </div>
        )}
      />
    </div>
  );
}`,
    rows: [['items', 'readonly T[]', 'required'], ['getItemKey', '(item: T, index: number) => Key；唯一且稳定', 'required'], ['renderItem', '(item: T, index: number) => ReactNode', 'required'], ['duration', 'number', '250 ms'], ['itemClassName', 'string', '—'], ['HTML attributes', 'HTMLAttributes<HTMLUListElement>', '—'], ['布局范围', '纵向列表；不包含拖拽、网格或退场保留', '—']],
  },
  {
    id: 'ripple', title: 'Ripple 点击涟漪', icon: '◎',
    description: '为原生按钮或链接添加从点击位置扩散的涟漪，保留原元素语义、ref 和事件。',
    preview: <RippleDemo />,
    code: `import { useState } from 'react';
import { Ripple } from 'atelier-motion/ripple';

export function ActionButton() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Ripple duration={550} color="#685cf6">
        <button type="button" onClick={() => setCount((value) => value + 1)}>
          执行操作
        </button>
      </Ripple>
      <p>已激活 {count} 次</p>
    </div>
  );
}`,
    rows: [['children', '单个原生 <button> 或 <a>，使用常规 children 内容', 'required'], ['duration', 'number', '550 ms'], ['color', 'string', 'currentColor'], ['disabled', 'boolean；仅关闭涟漪，不改变子元素行为', 'false'], ['键盘激活', '保留原元素键盘行为，涟漪从中心扩散', '—'], ['原元素 disabled / aria-disabled', '禁用状态不播放涟漪', '—']],
  },
  {
    id: 'textRotate', title: 'TextRotate 文案轮换', icon: '⇡',
    description: '整段文案淡入或向上滑动切换，支持自动轮播、暂停和受控索引。',
    preview: <TextRotateDemo />,
    code: `import { useState } from 'react';
import { TextRotate } from 'atelier-motion/text-rotate';

export function RotatingHeadline() {
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = useState(0);
  const words = ['Build with clarity', 'Ship with confidence'];

  return (
    <div>
      <button type="button" onClick={() => setPaused((value) => !value)}>
        {paused ? '继续轮播' : '暂停轮播'}
      </button>
      <TextRotate words={words} paused={paused} interval={2400} animation="slide-up" />
      <button type="button" onClick={() => setIndex((value) => (value + 1) % words.length)}>
        切换受控文案
      </button>
      <TextRotate words={words} index={index} animation="fade" />
    </div>
  );
}`,
    rows: [['words', 'readonly string[]；空数组显示空内容', 'required'], ['index', 'number；传入后由外部驱动，不自动轮播', '—'], ['defaultIndex', 'number；越界索引循环归一化', '0'], ['onIndexChange', '(index: number) => void；自动切换时触发', '—'], ['autoPlay', 'boolean；仅用于非受控模式', 'true'], ['paused', 'boolean', 'false'], ['pauseOnHover', 'boolean；获得焦点也会暂停', 'true'], ['interval', 'number；最小 100 ms', '2400 ms'], ['duration', 'number', '300 ms'], ['animation', "'fade' | 'slide-up'", 'slide-up'], ['aria-live', "'off' | 'polite' | 'assertive'；仅渲染当前文案", 'off'], ['HTML attributes', 'HTMLAttributes<HTMLSpanElement>', '—']],
  },
];
