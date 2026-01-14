import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const base = '/Soheil-Arsalan_MR/';
const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base,
  server: {
    open: base,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        normal_mode: resolve(rootDir, 'normal_mode/index.html'),
      },
    },
  }
});
