// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { defineConfig } from 'astro/config';
import chThemePlugin, { defaultTheme } from '@ch-ui/vite-plugin-theme';
import chIconsPlugin from '@ch-ui/vite-plugin-icons';
import { elementsAstro } from '@ch-ui/astro-stencil';

export default defineConfig({
  site: 'https://ch-ui.dev',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  vite: {
    plugins: [
      // @ts-ignore
      chThemePlugin({
        config: () => defaultTheme,
      }),
      // @ts-ignore
      chIconsPlugin({
        tokenPattern:
          'ph--([a-z]+[a-z-]*)--(bold|duotone|fill|light|regular|thin)',
        assetPath: (name, variant) =>
          `../../packages/icons/node_modules/@phosphor-icons/core/assets/${variant}/${name}${
            variant === 'regular' ? '' : `-${variant}`
          }.svg`,
        spritePath: 'public/icons.svg',
        contentPaths: ['**/src/**/*.{ts,tsx,astro,md}'],
      }),
    ],
  },
  integrations: [elementsAstro()],
});
