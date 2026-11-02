# Atelier Motion

English | [简体中文](./README.zh-CN.md)

A standalone React animation library extracted from `atelier-ui`, with 35 components and an independently deployable demo. It preserves the original component APIs and the `at-` CSS prefix, without depending on `atelier-ui` or adding an animation runtime.

## Development

Requires Node.js >= 20.19.0 and npm.

```sh
npm ci
npm run dev
```

Open <http://localhost:4100>. The demo includes global component search (⌘/Ctrl + K), individual component pages, at least two usage scenarios per component, independent animation replay, complete TSX examples, and API tables. URL hashes link directly to components, such as `/#fadeIn`.

```sh
npm run typecheck
npm run build        # Library output: dist/; demo output: docs/
npm run preview      # Preview the built demo
```

`docs/` uses relative asset paths and can be hosted at a static site's root or in a subdirectory. `dist/` and `docs/` are built separately. The npm package contains the library and README documentation.

## Installation and usage

Once published, install with:

```sh
npm install atelier-motion
```

React and React DOM 18 are peer dependencies. ESM, CommonJS, and TypeScript declarations are supported.

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

You can also import from the main entry:

```tsx
import { FadeIn, SlideIn, Transition, TransitionGroup } from 'atelier-motion';
```

ESM entries automatically import the corresponding CSS and require a bundler that supports CSS imports, such as Vite. Prefer individual component imports to avoid unrelated component styles. CommonJS loads styles in browser bundling environments and skips CSS loading in Node.js for server rendering. SSR applications still need to import component styles in their client entry.

```tsx
import 'atelier-motion/theme.css';
import 'atelier-motion/styles/fade-in.css'; // Maps to dist/fade-in.css
```

Override `--at-*` theme variables to customize colors, border radii, and easing curves. The theme only defines variables; it does not override the host application's typography, form elements, or global interaction styles. Components respect `prefers-reduced-motion`.

## Component directory

| Component | Individual entry | Purpose |
| --- | --- | --- |
| ProgressRing | `atelier-motion/progress-ring` | Circular determinate progress |
| Parallax | `atelier-motion/parallax` | Page or container scroll parallax |
| GradientText | `atelier-motion/gradient-text` | Animated gradients for marketing headlines |
| ImageReveal | `atelier-motion/image-reveal` | Directional image reveals on viewport entry |
| ScrollProgress | `atelier-motion/scroll-progress` | Page or container reading progress |
| Tilt | `atelier-motion/tilt` | Pointer-driven tilt feedback |
| Spotlight | `atelier-motion/spotlight` | Light that follows the pointer |
| AutoSize | `atelier-motion/auto-size` | Smooth height changes as content updates |
| LayoutList | `atelier-motion/layout-list` | Position animations for vertical list reordering, insertion, and removal |
| Ripple | `atelier-motion/ripple` | Ripples from pointer coordinates or the center on keyboard activation |
| TextRotate | `atelier-motion/text-rotate` | Automatic or controlled rotation of whole phrases |
| AnimatedList | `atelier-motion/animated-list` | Staggered list entrances |
| BlurFade | `atelier-motion/blur-fade` | Blurred fade-in |
| BorderBeam | `atelier-motion/border-beam` | Animated border light |
| Confetti | `atelier-motion/confetti` | Celebration particles |
| Expand | `atelier-motion/expand` | Controlled expansion and collapse |
| FadeIn | `atelier-motion/fade-in` | Opacity fade-in |
| FlipCard | `atelier-motion/flip-card` | Controlled front/back card flipping |
| FlipIn | `atelier-motion/flip-in` | Flip entrance |
| Glow | `atelier-motion/glow` | Looping soft glow |
| HoverLift | `atelier-motion/hover-lift` | Lift on hover |
| Marquee | `atelier-motion/marquee` | Continuous scrolling |
| NumberTicker | `atelier-motion/number-ticker` | Animated numeric values |
| Press | `atelier-motion/press` | Press feedback |
| Pulse | `atelier-motion/pulse` | Breathing effect |
| ScaleIn | `atelier-motion/scale-in` | Scale entrance |
| ScrollReveal | `atelier-motion/scroll-reveal` | Reveal on viewport entry |
| Shake | `atelier-motion/shake` | Horizontal shake feedback |
| Shimmer | `atelier-motion/shimmer` | Sweeping surface highlight |
| SlideIn | `atelier-motion/slide-in` | Directional slide entrance |
| Stagger | `atelier-motion/stagger` | Staggered child entrances |
| Transition | `atelier-motion/transition` | Enter and exit lifecycle |
| TransitionGroup | `atelier-motion/transition-group` | Dynamic items managed by stable keys |
| TypingAnimation | `atelier-motion/typing-animation` | Character-by-character typing |
| Wobble | `atelier-motion/wobble` | Wobble feedback |

Most component durations use milliseconds. `Marquee.duration` and `BorderBeam.duration` use seconds. See the demo API tables and exported Props types for parameters and defaults.

`TransitionGroup` directly accepts `Transition` elements with stable keys. Update state immediately when removing business data; use `Transition.exit` to provide an exit snapshot without interactive form controls. `Expand` and `FlipCard` are controlled by the caller.

## Publishing

```sh
npm run typecheck
npm run build
npm pack --dry-run
npm pack
```

The `prepack` hook checks types and builds the library automatically. Install the generated `atelier-motion-0.1.0.tgz` in a consumer project to validate it locally.

Before publishing publicly, verify package name availability, the version, account permissions, and permission to distribute the source. Then run:

```sh
npm login
npm publish --access public
```

The project is configured for public publishing. Repository initialization did not publish the package or deploy the demo.

## Migration

Replace imports from `atelier-ui` with `atelier-motion`; component usage stays the same. The original `atelier-ui` repository was not modified during extraction, so existing consumers can migrate gradually.

## Content and layout animations

- `AutoSize` uses `ResizeObserver` to measure natural content height, including asynchronous content and line wrapping. Do not set a fixed outer height; put content spacing on child elements. Environments without this API retain natural height.
- `LayoutList` identifies items through unique, stable `getItemKey` values and smoothly moves retained items in a vertical list. New items appear immediately and removed items disappear immediately. Dragging, grids, and retained exit animations are outside its scope. The component manages item transforms; apply custom transforms to child elements. Without the Web Animations API, layout updates immediately.
- `Ripple` accepts one native `button` or `a`, preserving its ref, events, and attributes. Use regular children; `dangerouslySetInnerHTML` is unsupported. Native disabled state, `aria-disabled`, disabled effects, and reduced motion suppress ripples. `Ripple.disabled` only disables the effect, not navigation or button actions. Preventing the original event's default behavior also suppresses the ripple.
- `TextRotate` switches whole phrases every 2400ms by default, with `paused` and `autoPlay` controls. Hover and focus pauses help avoid interrupting reading. Passing `index` makes it controlled and stops automatic timing; `onIndexChange` only reports internal automatic changes. Indices wrap, empty arrays display no text, and a single phrase creates no timer. Assistive technology reads only the current phrase, with no live announcement by default. Reduced motion preserves phrase changes without animation.

For these four components, `duration` and `TextRotate.interval` use milliseconds. Invalid durations fall back to defaults, negative durations become zero, and `interval` has a minimum of 100ms.

## Automated tests

After installing dependencies, download the browsers matching the locked test framework version:

```sh
npm ci
npx playwright install chromium firefox webkit
# For Linux CI: npx playwright install --with-deps chromium firefox webkit
```

```sh
npm test                 # Unit, component, demo, and SSR tests
npm run test:watch       # Vitest watch mode
npm run test:coverage    # Unit tests and component source coverage thresholds
npm run typecheck:tests  # Type-check components, demo, tests, and test configs
npm run test:e2e         # Real-browser end-to-end tests
npm run test:all         # Type checks → coverage → end-to-end tests
```

### Test scope

| Test file | Coverage |
| --- | --- |
| `tests/behavior.test.tsx` | Controlled state, timers, transition callbacks, formatting, boundaries, list identity, ref and event preservation |
| `tests/browser-apis.test.tsx` | Observer callbacks and cleanup, scroll progress, pointer movement and reset, reduced motion, animation timing |
| `tests/edge-cases.test.tsx` | Repeated reordering and cancellation, removal cleanup, re-entry during exit, dynamic props, ripple coordinates and disabled combinations |
| `tests/demo.test.tsx` | Two scenarios for all 35 components, code display, independent replay, FAQ, validation, and progress interactions |
| `tests/ssr.test.tsx` | Server rendering of representative components in Node without browser APIs |
| `tests/e2e/motion.spec.ts` | All component pages and horizontal overflow, keyboard ripples, actual list movement, form height, scroll progress and parallax, collapse focus and inert content |

Unit tests use Vitest, React Testing Library, and jsdom. Browser APIs are mocked as needed and restored after each test. SSR tests run separately in Node. End-to-end tests use Playwright across desktop Chromium, mobile Chromium emulation, Firefox, and WebKit.

Playwright starts a separate server at `127.0.0.1:4178`, which must be available. It does not reuse the regular development server on port 4100. Run one browser with `npm run test:e2e -- --project=chromium`.

### Latest verification results

Local verification on 2026-11-02:

- All 91 unit, component, demo, and SSR tests passed across five Vitest test files.
- All 24 end-to-end cases passed: six scenarios across four browser projects. The component-page scenario visits all 35 component pages.
- `npm run typecheck:tests` passed.
- Component source coverage: statements 97.16%, branches 87.81%, functions 96.18%, lines 98.81%.

These numbers are a snapshot of that run. After subsequent changes, use freshly generated reports.

### Coverage and reports

Component source coverage thresholds are 90% statements, 80% branches, 90% functions, and 95% lines. Coverage excludes demo code, tests, and component entry files that only re-export modules. End-to-end tests do not contribute to these percentages.

- Unit coverage report: `coverage/index.html`.
- Browser test report: `playwright-report/index.html`; open it with `npx playwright show-report`.
- Failed browser tests retain screenshots and traces in `test-results/`, accessible through the HTML report.
- Generated reports are excluded from Git through `.gitignore`.

Tests verify specific states, geometry, animation execution, and keyboard behavior. They do not replace pixel-level visual regression, comprehensive assistive technology checks, or testing on physical mobile devices. SSR currently covers representative components, not a hydration matrix for every exported component.
