// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { defineConfig } from 'astro/config';
import chThemePlugin, {
  type PhysicalColorTokensConfig,
  type SemanticColorTokensConfig
} from '@ch-ui/vite-plugin-theme';
import chIconsPlugin from '@ch-ui/vite-plugin-icons'
import { resolve } from 'node:path';

const physicalColors: PhysicalColorTokensConfig = {
  gamuts: ['P3', 'rec2020'],
  shadeNumbering: 'emissive',
  palettes: {
    primary: {
      keyColor: [43, 83, 282],
      darkCp: 0.86,
      lightCp: 1,
      hueTorsion: -30
    }
  }
};

const semanticColors: SemanticColorTokensConfig<typeof physicalColors> = {
  themes: { light: null, dark: '@media (prefers-color-scheme: dark)' },
  semanticColors: {
    'ch-bg-input': {
      light: '--primary-100',
      dark: '--primary-900'
    }
  }
};

const defaultTheme = {
  physicalColors,
  semanticColors
};

export default defineConfig({
  site: 'https://ch-ui.dev',
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
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
          `./packages/icons/node_modules/@phosphor-icons/core/assets/${variant}/${name}${
            variant === 'regular' ? '' : `-${variant}`
          }.svg`,
        spritePath: resolve(__dirname, 'public/icons.svg'),
        contentPaths: ['src/**/*.{ts,tsx,astro}'],
      })
    ]
  }
});
