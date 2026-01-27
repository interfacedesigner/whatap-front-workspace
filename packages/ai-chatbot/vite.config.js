import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    cssCodeSplit: true,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/main.js'),
        style: resolve(__dirname, 'src/style.css'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['highlight.js', 'ky'],
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
});
