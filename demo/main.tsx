import { StrictMode, useEffect, useRef, useState } from 'react';
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(0);
  const searchDialogRef = useRef<HTMLDialogElement>(null);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onHashChange = () => { setPage(readPage()); setMenuOpen(false); };
    const onSearchKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener('keydown', onSearchKey);
    window.addEventListener('hashchange', onHashChange);
    return () => { window.removeEventListener('hashchange', onHashChange); window.removeEventListener('keydown', onSearchKey); };
  }, []);
  useEffect(() => {
    const dialog = searchDialogRef.current;
    if (searchOpen && !dialog?.open) { dialog?.showModal(); searchInputRef.current?.focus(); }
    else if (!searchOpen && dialog?.open) dialog.close();
  }, [searchOpen]);
  const results = animationPages.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  const closeSearch = () => { setSearchOpen(false); searchTriggerRef.current?.focus(); };
  const selectSearchResult = (id: string) => { window.location.hash = id; setQuery(''); setActiveResult(0); closeSearch(); };
  return <div className="site-shell">
    <a className="skip-link" href="#content" onClick={(event) => { event.preventDefault(); document.getElementById('content')?.focus(); }}>跳到内容</a>
    <aside className={`sidebar ${menuOpen ? 'sidebar--open' : ''}`}>
      <a className="brand" href="#overview">✳ atelier<span>motion</span></a>
      <div className="sidebar-meta">REACT MOTION LIBRARY <span>v0.1.0</span></div>
      <nav aria-label="组件导航">
        <a href="#overview" aria-current={page === 'overview' ? 'page' : undefined}>概览与安装</a>
        <p className="nav-label">动画组件 · {animationPages.length}</p>
        {animationPages.map((item) => <a key={item.id} href={`#${item.id}`} aria-current={page === item.id ? 'page' : undefined}><span aria-hidden="true">{item.icon}</span>{item.title}</a>)}
      </nav>
      <p className="sidebar-footer">Small details. Meaningful motion.</p>
    </aside>
    <main className="main-area">
      <header className="topbar"><button type="button" className="mobile-menu" aria-label="切换导航" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>☰</button><span>Atelier Motion / {page === 'overview' ? '概览' : animationPages.find((item) => item.id === page)?.title}</span><div className="topbar__right"><button ref={searchTriggerRef} className="search-trigger" type="button" aria-label="全局搜索，Command 或 Control 加 K" onClick={() => setSearchOpen(true)}>⌕ <span>⌘ K</span></button><span className="topbar-status">React · TypeScript</span></div></header>
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
        <dialog ref={searchDialogRef} className="search-dialog" aria-label="全局搜索组件" onCancel={() => setSearchOpen(false)} onClose={() => setSearchOpen(false)}>
          <div className="search-dialog__header"><label htmlFor="global-search">搜索动画组件</label><button type="button" onClick={closeSearch} aria-label="关闭搜索">×</button></div>
          <input ref={searchInputRef} id="global-search" value={query} placeholder="输入组件名称或效果…" onChange={(event) => { setQuery(event.target.value); setActiveResult(0); }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') { event.preventDefault(); setActiveResult((value) => Math.min(results.length - 1, value + 1)); }
              if (event.key === 'ArrowUp') { event.preventDefault(); setActiveResult((value) => Math.max(0, value - 1)); }
              if (event.key === 'Enter' && results[activeResult]) { event.preventDefault(); selectSearchResult(results[activeResult].id); }
            }} />
          <div className="search-dialog__results" role="listbox" aria-label="搜索结果">
            {results.map((item, index) => <button type="button" role="option" aria-selected={index === activeResult} key={item.id} onMouseEnter={() => setActiveResult(index)} onClick={() => selectSearchResult(item.id)}><span aria-hidden="true">{item.icon}</span><span><strong>{item.title}</strong><small>{item.description}</small></span></button>)}
            {results.length === 0 && <p role="status">没有匹配的组件</p>}
          </div>
          <p className="search-dialog__hint">↑ ↓ 选择 · Enter 打开 · Esc 关闭</p>
        </dialog>
      </div>
    </main>
  </div>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
