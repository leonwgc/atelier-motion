import { resolve } from 'node:path';
import { defineConfig } from 'vite';

function attachExtractedCss() {
  return {
    name: 'atelier-attach-extracted-css',
    generateBundle(outputOptions: { format?: string }, bundle: Record<string, unknown>) {
      for (const item of Object.values(bundle)) {
        if (!item || typeof item !== 'object' || !('type' in item) || item.type !== 'chunk') continue;
        const chunk = item as unknown as {
          code: string;
          fileName: string;
          modules: Record<string, unknown>;
          viteMetadata?: { importedCss?: Set<string> };
        };
        const cssFiles = chunk.viteMetadata?.importedCss;
        if (!cssFiles?.size) continue;
        const moduleIds = Object.keys(chunk.modules);
        if (!moduleIds.some((id) => /\.tsx?($|\?)/.test(id))) continue;
        const imports = new Set([...cssFiles].map((file) => `./${file}`));
        imports.add('./theme.css');
        chunk.code = outputOptions.format === 'es'
          ? `${[...imports].map((file) => `import ${JSON.stringify(file)};`).join('\n')}\n${chunk.code}`
          : `if(typeof document!=="undefined"&&!(typeof process!=="undefined"&&process.versions?.node)){${[...imports].map((file) => `require(${JSON.stringify(file)});`).join('')}}\n${chunk.code}`;
      }
    },
  };
}

export default defineConfig({
  plugins: [attachExtractedCss()],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: {
        index: resolve(process.cwd(), 'src/index.ts'),
        'scroll-progress': resolve(process.cwd(), 'src/entries/scroll-progress.ts'),
        'tilt': resolve(process.cwd(), 'src/entries/tilt.ts'),
        'spotlight': resolve(process.cwd(), 'src/entries/spotlight.ts'),

        'auto-size': resolve(process.cwd(), 'src/entries/auto-size.ts'),
        'layout-list': resolve(process.cwd(), 'src/entries/layout-list.ts'),
        'ripple': resolve(process.cwd(), 'src/entries/ripple.ts'),
        'text-rotate': resolve(process.cwd(), 'src/entries/text-rotate.ts'),

        'border-beam': resolve(process.cwd(), 'src/entries/border-beam.ts'),
        'marquee': resolve(process.cwd(), 'src/entries/marquee.ts'),
        'number-ticker': resolve(process.cwd(), 'src/entries/number-ticker.ts'),
        'typing-animation': resolve(process.cwd(), 'src/entries/typing-animation.ts'),
        'blur-fade': resolve(process.cwd(), 'src/entries/blur-fade.ts'),
        'fade-in': resolve(process.cwd(), 'src/entries/fade-in.ts'),
        'slide-in': resolve(process.cwd(), 'src/entries/slide-in.ts'),
        'scroll-reveal': resolve(process.cwd(), 'src/entries/scroll-reveal.ts'),
        'scale-in': resolve(process.cwd(), 'src/entries/scale-in.ts'),
        'stagger': resolve(process.cwd(), 'src/entries/stagger.ts'),
        'expand': resolve(process.cwd(), 'src/entries/expand.ts'),
        'pulse': resolve(process.cwd(), 'src/entries/pulse.ts'),
        'glow': resolve(process.cwd(), 'src/entries/glow.ts'),
        'shake': resolve(process.cwd(), 'src/entries/shake.ts'),
        'wobble': resolve(process.cwd(), 'src/entries/wobble.ts'),
        'hover-lift': resolve(process.cwd(), 'src/entries/hover-lift.ts'),
        'press': resolve(process.cwd(), 'src/entries/press.ts'),
        'flip-in': resolve(process.cwd(), 'src/entries/flip-in.ts'),
        'flip-card': resolve(process.cwd(), 'src/entries/flip-card.ts'),
        'confetti': resolve(process.cwd(), 'src/entries/confetti.ts'),
        'shimmer': resolve(process.cwd(), 'src/entries/shimmer.ts'),
        'animated-list': resolve(process.cwd(), 'src/entries/animated-list.ts'),
        'transition': resolve(process.cwd(), 'src/entries/transition.ts'),
        'transition-group': resolve(process.cwd(), 'src/entries/transition-group.ts'),
      },
      name: 'AtelierMotion',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
      output: {
        assetFileNames: (asset) => (asset.names[0] ?? 'style.css').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
      },
    },
  },
});
