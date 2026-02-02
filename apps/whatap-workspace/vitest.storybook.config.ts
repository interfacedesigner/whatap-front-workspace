import { storybookTest } from '@storybook/experimental-addon-test/vitest-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    storybookTest({
      configDir: path.join(__dirname, '.storybook'),
    }),
  ],
  test: {
    name: 'storybook',
    browser: {
      enabled: true,
      headless: true,
      provider: 'playwright',
      instances: [{ browser: 'chromium' }],
    },
    setupFiles: ['./.storybook/vitest.setup.ts'],
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
