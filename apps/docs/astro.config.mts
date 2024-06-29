// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { defineConfig } from 'astro/config';
import chTokensPlugin, { defaultTokenSet } from '@ch-ui/vite-plugin-tokens';
import chIconsPlugin from '@ch-ui/vite-plugin-icons';
import { elementsAstro } from '@ch-ui/astro-stencil';
import merge from 'lodash.merge';
// Appease TS2742:
import _astro from 'astro';
import { SemanticLayer } from '@ch-ui/tokens';

// TODO(thure): Keep in-sync with tokens.ts, which this doesn’t like to import…
const docsTokens = merge({}, defaultTokenSet, {
  colors: {
    semantic: {
      sememes: {
        'illustration-1': {
          light: ['accent', 700],
          dark: ['accent', 900],
        },
        'illustration-2': {
          light: ['accent', 600],
          dark: ['accent', 800],
        },
        'illustration-3': {
          light: ['accent', 500],
          dark: ['accent', 700],
        },
        'illustration-4': {
          light: ['accent', 400],
          dark: ['accent', 600],
        },
        'illustration-5': {
          light: ['accent', 300],
          dark: ['accent', 500],
        },
      } satisfies SemanticLayer['sememes'],
    },
  },
});

export default defineConfig({
  site: 'https://ch-ui.dev',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  vite: {
    plugins: [
      // @ts-ignore
      chTokensPlugin({
        config: () => docsTokens,
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
