import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';

const rootPath = path.resolve(__dirname, '../');

const config: StorybookConfig = {
  framework: '@storybook/react-vite',

  stories: [
    { directory: `${rootPath}/src/pages`, files: '**/*.stories.@(ts|tsx)', titlePrefix: 'Pages' },
    { directory: `${rootPath}/src/widgets`, files: '**/*.stories.@(ts|tsx)', titlePrefix: 'Widgets' },
    { directory: `${rootPath}/src/features`, files: '**/*.stories.@(ts|tsx)', titlePrefix: 'Features' },
    { directory: `${rootPath}/src/entities`, files: '**/*.stories.@(ts|tsx)', titlePrefix: 'Entities' },
    { directory: `${rootPath}/src/shared`, files: '**/*.stories.@(ts|tsx)', titlePrefix: 'Shared' },
  ],

  addons: ['@storybook/addon-essentials', '@storybook/experimental-addon-test'],

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },

  core: {
    disableTelemetry: true,
  },

  async viteFinal(viteConfig) {
    const { mergeConfig } = await import('vite');
    const tsconfigPaths = (await import('vite-tsconfig-paths')).default;

    return mergeConfig(viteConfig, {
      plugins: [tsconfigPaths({ projects: [path.resolve(rootPath, 'tsconfig.json')] })],
    });
  },
};

export default config;
