import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { alias: [
    { find: /^atelier-motion\/(.+)$/, replacement: resolve('src/entries/$1.ts') },
    { find: 'atelier-motion', replacement: resolve('src/index.ts') },
  ] },
  test: {
    include: ['tests/**/*.test.{ts,tsx}'], environment: 'jsdom', setupFiles: ['./tests/setup.ts'],
    coverage: { provider: 'v8', thresholds: { statements: 90, branches: 80, functions: 90, lines: 95 }, include: ['src/**/*.{ts,tsx}'], exclude: ['src/entries/**', 'src/vite-env.d.ts'], reporter: ['text', 'html', 'json-summary'] },
  },
});
