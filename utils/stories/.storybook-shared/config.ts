// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { type StorybookConfig } from '@storybook/web-components-vite';
import { mergeConfig } from 'vite';
import TurbosnapPlugin from 'vite-plugin-turbosnap';
import IconsPlugin from '@ch-ui/vite-plugin-icons';
import ThemePlugin from '@ch-ui/vite-plugin-theme';
import { resolve } from 'node:path';
import previewThemeConfig from './preview.ch-t';

export const config = (
  specificConfig: Partial<StorybookConfig> & Pick<StorybookConfig, 'stories'>,
  turbosnapRootDir?: string,
): StorybookConfig => ({
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-themes',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: [resolve(__dirname, '../dist')],
  viteFinal: async (config) => {
    return mergeConfig(config, {
      plugins: [
        TurbosnapPlugin({
          rootDir: turbosnapRootDir ?? config.root ?? __dirname,
        }),
        ThemePlugin({
          config: () => previewThemeConfig,
        }),
        IconsPlugin({
          tokenPattern:
            'ph-icon--([a-z]+[a-z-]*)--(bold|duotone|fill|light|regular|thin)',
          assetPath: (name, variant) =>
            `./packages/icons/node_modules/@phosphor-icons/core/assets/${variant}/${name}${
              variant === 'regular' ? '' : `-${variant}`
            }.svg`,
          spritePath: resolve(__dirname, '../dist/assets/sprite.svg'),
          contentPath: '**/*.stories.{ts,tsx}',
        }),
      ],
    });
  },
  ...specificConfig,
});
