// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  PhysicalColorTokensConfig,
  SemanticColorTokensConfig,
  TypographyTokensConfig,
} from './configs';
import { ExponentialSeries, LinearSeries } from './types';

export type ThemeConfig = {
  physicalColors?: PhysicalColorTokensConfig;
  semanticColors?: SemanticColorTokensConfig<any>;
  typography?: TypographyTokensConfig<any>;
};

// DEFAULT THEME VALUES

const defaultPhysicalColors: PhysicalColorTokensConfig = {
  gamuts: ['p3', 'rec2020'],
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

const defaultSemanticColors: SemanticColorTokensConfig<
  typeof defaultPhysicalColors
> = {
  themes: {
    light: [':root'],
    dark: ['@media (prefers-color-scheme: dark)', ':root'],
  },
  semanticColors: {
    'ch-bg-input': {
      light: ['primary', 100],
      dark: ['primary', 900],
    },
  },
};

const defaultWeights: LinearSeries = {
  initial: 0,
  slope: 1,
  keys: {
    regular: 400,
    bold: 700,
  },
};

const defaultExponentialKeys: ExponentialSeries['keys'] = {
  '2xs': -3,
  xs: -2,
  s: -1,
  base: 0,
  lg: 1,
  xl: 2,
  '2xl': 3,
  '3xl': 4,
  '4xl': 5,
};

const defaultSizes: ExponentialSeries = {
  initial: 1,
  unit: 'rem',
  base: 1.2,
  keys: defaultExponentialKeys,
};

const defaultLineHeights: ExponentialSeries = {
  initial: 1.25,
  unit: 'rem',
  base: 1.16, // <- larger type sizes benefit from less leading
  keys: defaultExponentialKeys,
  snapTo: {
    method: 'ceil',
    initial: 0,
    slope: 0.25,
  },
};

const defaultFontStyles: Record<string, string> = {
  normal: 'normal',
  italic: 'italic',
};

const typographyThemes = {
  mobile: [':root'],
};

const defaultTypography: TypographyTokensConfig<typeof typographyThemes> = {
  themes: typographyThemes,
  fonts: {
    text: {
      mobile: {
        fontFamily: 'sans-serif',
        sizes: defaultSizes,
        lineHeights: defaultLineHeights,
        weights: defaultWeights,
        fontStyles: defaultFontStyles,
      },
    },
  },
};

export const defaultTheme = {
  physicalColors: defaultPhysicalColors,
  semanticColors: defaultSemanticColors,
  typography: defaultTypography,
};
