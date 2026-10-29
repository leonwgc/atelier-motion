import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'demo',
  base: './',
  resolve: {
    alias: [
      { find: /^atelier-motion\/(.+)$/, replacement: resolve(process.cwd(), 'src/entries/$1.ts') },
      { find: 'atelier-motion', replacement: resolve(process.cwd(), 'src/index.ts') },
    ],
  },
  server: { host: '127.0.0.1', port: 4100 },
  build: { outDir: '../docs', emptyOutDir: true },
});
