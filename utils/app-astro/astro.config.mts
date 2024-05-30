// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { defineConfig } from 'astro/config';
import vitePluginTheme, {
  type PhysicalColorTokensConfig,
  type SemanticColorTokensConfig
} from '@ch-ui/vite-plugin-theme';

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
    // @ts-ignore
    plugins: [vitePluginTheme({
      config: () => defaultTheme,
    })]
  }
});
