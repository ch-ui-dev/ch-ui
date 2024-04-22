// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { type StorybookConfig } from '@storybook/react-vite';
import ReactPlugin from '@vitejs/plugin-react';
import flatten from 'lodash.flatten';
import { mergeConfig } from 'vite';
import TurbosnapPlugin from 'vite-plugin-turbosnap';
import IconsPlugin from '@ch-ui/vite-plugin-icons';
import { resolve } from 'node:path';

export const config = (
  specificConfig: Partial<StorybookConfig> & Pick<StorybookConfig, 'stories'>,
  turbosnapRootDir?: string,
): StorybookConfig => ({
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {
      strictMode: true,
    },
  },
  staticDirs: [resolve(__dirname, '../dist')],
  viteFinal: async (config, { configType }) => {
    return mergeConfig(
      configType === 'PRODUCTION'
        ? {
            ...config,
            // TODO(thure): build fails for @preact/signals-react: https://github.com/preactjs/signals/issues/269
            plugins: flatten(config.plugins).map((plugin: any) => {
              return plugin.name === 'vite:react-babel'
                ? ReactPlugin({
                    jsxRuntime: 'classic',
                  })
                : plugin.name === 'vite:react-jsx'
                ? undefined
                : plugin;
            }),
          }
        : config,
      {
        // When `jsxRuntime` is set to 'classic', top-level awaits are rejected unless build.target is 'esnext'
        ...(configType === 'PRODUCTION' && { build: { target: 'esnext' } }),
        server: {
          hmr: {
            overlay: false,
          },
        },
        plugins: [
          TurbosnapPlugin({
            rootDir: turbosnapRootDir ?? config.root ?? __dirname,
          }),
          IconsPlugin({
            tokenPattern:
              'ph-icon--([a-z]+[a-z-]*)--(bold|duotone|fill|light|regular|thin)',
            assetPath: (name, variant) =>
              `./packages/icons/node_modules/@phosphor-icons/core/assets/${variant}/${name}${
                variant === 'regular' ? '' : `-${variant}`
              }.svg`,
            spritePath: resolve(__dirname, '../dist/assets/sprite.svg'),
            contentPath: '**/*.stories.tsx',
          }),
        ],
      },
    );
  },
  ...specificConfig,
});
