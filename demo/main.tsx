import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimationPage, animationPages, isAnimationPageId, type AnimationPageId } from './AnimationPages';
import './styles.css';

function readPage(): AnimationPageId | 'overview' {
  const id = window.location.hash.slice(1);
  return isAnimationPageId(id) ? id : 'overview';
}

function App() {
  const [page, setPage] = useState(readPage);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onHashChange = () => { setPage(readPage()); setMenuOpen(false); };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  const results = animationPages.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="site-shell">
    <a className="skip-link" href="#content" onClick={(event) => { event.preventDefault(); document.getElementById('content')?.focus(); }}>跳到内容</a>
    <aside className={`sidebar ${menuOpen ? 'sidebar--open' : ''}`}>
      <a className="brand" href="#overview">✳ atelier<span>motion</span></a>
      <div className="sidebar-meta">REACT MOTION LIBRARY <span>v0.1.0</span></div>
      <label className="search-label" htmlFor="search">搜索组件</label>
      <input id="search" placeholder="名称或效果…" value={query} onChange={(event) => setQuery(event.target.value)} />
      <nav aria-label="组件导航">
        <a href="#overview" aria-current={page === 'overview' ? 'page' : undefined}>概览与安装</a>
        <p className="nav-label">动画组件 · {animationPages.length}</p>
        {results.map((item) => <a key={item.id} href={`#${item.id}`} aria-current={page === item.id ? 'page' : undefined}><span aria-hidden="true">{item.icon}</span>{item.title}</a>)}
        {results.length === 0 && <p role="status">没有匹配的组件</p>}
      </nav>
      <p className="sidebar-footer">Small details. Meaningful motion.</p>
    </aside>
    <main className="main-area">
      <header className="topbar"><button type="button" className="mobile-menu" aria-label="切换导航" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>☰</button><span>Atelier Motion / {page === 'overview' ? '概览' : animationPages.find((item) => item.id === page)?.title}</span><span className="topbar-status">React · TypeScript</span></header>
      <div className="content-wrap" id="content" tabIndex={-1}>
        {page === 'overview' ? <>
          <section className="hero"><span className="eyebrow">ATELIER / MOTION</span><h1>让界面的每一次变化，<br /><em>都恰到好处。</em></h1><p>{animationPages.length} 个独立的 React 动画组件。从轻柔的渐入到即时交互反馈，保留熟悉的 API，按需引入，自由组合。</p><div className="hero-actions"><a className="primary-link" href="#fadeIn">开始体验 ↗</a><span>CSS 动画 · 无动画运行时依赖</span></div></section>
          <section className="install"><h2>安装与使用</h2><pre><code>npm install atelier-motion</code></pre><p>需要 React 18。组件入口会自动加载对应样式，支持总入口与按组件导入。</p><pre><code>{`import { FadeIn } from 'atelier-motion/fade-in';

export function Welcome() {
  return <FadeIn duration={600}>Hello, motion.</FadeIn>;
}`}</code></pre><p>遵循系统的“减少动态效果”偏好。各组件时长单位请参考对应 API。</p></section>
          <section><div className="catalog-heading"><h2>组件目录</h2><span>{results.length} / {animationPages.length}</span></div><div className="catalog">{results.map((item) => <a className="catalog-card" href={`#${item.id}`} key={item.id}><span className="catalog-icon" aria-hidden="true">{item.icon}</span><h3>{item.title}</h3><p>{item.description}</p><span className="catalog-arrow" aria-hidden="true">↗</span></a>)}</div></section>
        </> : <AnimationPage key={page} id={page} />}
        <footer>Atelier Motion · 为产品界面赋予节奏</footer>
      </div>
    </main>
  </div>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
