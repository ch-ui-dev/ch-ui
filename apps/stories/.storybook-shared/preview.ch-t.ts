// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  type PhysicalColorTokensConfig,
  type SemanticColorTokensConfig,
} from '@ch-ui/vite-plugin-theme';

const physicalColors: PhysicalColorTokensConfig = {
  gamuts: ['P3', 'rec2020'],
  shadeNumbering: 'emissive',
  palettes: {
    primary: {
      keyColor: [43, 83, 282],
      darkCp: 0.86,
      lightCp: 1,
      hueTorsion: -30,
    },
  },
};

const semanticColors: SemanticColorTokensConfig<typeof physicalColors> = {
  themes: {
    light: [':root'],
    dark: ['@media (prefers-color-scheme: dark)', ':root'],
  },
  semanticColors: {
    'ch-bg-input': {
      light: '--primary-100',
      dark: '--primary-900',
    },
  },
};

export default {
  physicalColors,
  semanticColors,
};
