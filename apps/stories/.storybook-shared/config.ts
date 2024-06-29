// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { type StorybookConfig } from '@storybook/web-components-vite';
import { mergeConfig } from 'vite';
import TurbosnapPlugin from 'vite-plugin-turbosnap';
import IconsPlugin from '@ch-ui/vite-plugin-icons';
import ThemePlugin, { defaultTheme } from '@ch-ui/vite-plugin-tokens';
import { resolve } from 'node:path';

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
          config: () => defaultTheme,
        }),
        IconsPlugin({
          tokenPattern:
            'ph--([a-z]+[a-z-]*)--(bold|duotone|fill|light|regular|thin)',
          assetPath: (name, variant) =>
            `./packages/icons/node_modules/@phosphor-icons/core/assets/${variant}/${name}${
              variant === 'regular' ? '' : `-${variant}`
            }.svg`,
          spritePath: resolve(__dirname, '../dist/assets/sprite.svg'),
          contentPaths: ['**/*.stories.{ts,tsx}'],
        }),
      ],
    });
  },
  ...specificConfig,
});
