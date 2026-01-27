import type { StorybookConfig } from '@storybook/react-vite';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootPath = path.resolve(import.meta.dirname, '../');

const config: StorybookConfig = {
  framework: getAbsolutePath('@storybook/react-vite'),

  stories: [
    { directory: `${rootPath}/src/fsd/2_pages`, files: '**/*.stories.@(ts|tsx)', titlePrefix: 'Pages' },
    { directory: `${rootPath}/src/fsd/3_widgets`, files: '**/*.stories.@(ts|tsx)', titlePrefix: 'Widgets' },
    { directory: `${rootPath}/src/fsd/4_features`, files: '**/*.stories.@(ts|tsx)', titlePrefix: 'Features' },
    { directory: `${rootPath}/src/fsd/5_entities`, files: '**/*.stories.@(ts|tsx)', titlePrefix: 'Entities' },
    { directory: `${rootPath}/src/fsd/6_shared`, files: '**/*.stories.@(ts|tsx)', titlePrefix: 'Shared' },
  ],

  addons: [getAbsolutePath('@storybook/addon-essentials'), getAbsolutePath('@storybook/addon-interactions')],

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

function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
