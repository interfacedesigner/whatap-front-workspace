import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/', '**/*.d.ts', '**/*.stories.tsx', 'styled-system/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@fsd': path.resolve(__dirname, './src/fsd'),
      '@app': path.resolve(__dirname, './src/fsd/1_app'),
      '@pages': path.resolve(__dirname, './src/fsd/2_pages'),
      '@widgets': path.resolve(__dirname, './src/fsd/3_widgets'),
      '@features': path.resolve(__dirname, './src/fsd/4_features'),
      '@entities': path.resolve(__dirname, './src/fsd/5_entities'),
      '@shared': path.resolve(__dirname, './src/fsd/6_shared'),
      '@styled-system': path.resolve(__dirname, './styled-system'),
    },
  },
});
