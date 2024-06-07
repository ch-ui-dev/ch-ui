// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  ColorTokensConfig,
  PhysicalColorTokensConfig,
  SemanticColorTokensConfig,
  TypographyTokensConfig,
} from './configs';
import { ExponentialSeries, LinearSeries } from './types';

export type ThemeConfig = {
  colors?: ColorTokensConfig<any>;
  typography?: TypographyTokensConfig<any>;
};

// DEFAULT THEME VALUES

const defaultPhysicalColors: PhysicalColorTokensConfig = {
  gamuts: ['p3', 'rec2020'],
  shadeNumbering: 'emissive',
  palettes: {
    neutral: {
      keyColor: [47, 3.5, 282],
      darkCp: 0.8,
      lightCp: 0.88,
      hueTorsion: 0,
    },
    accent: {
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
    'bg-base': {
      light: ['neutral', 975],
      dark: ['neutral', 150],
    },
    'bg-input': {
      light: ['neutral', 950],
      dark: ['neutral', 175],
    },
    'bg-hover': {
      light: ['neutral', 925],
      dark: ['neutral', 200],
    },
    'bg-accent': {
      light: ['accent', 500],
      dark: ['accent', 550],
    },
    'bg-accentHover': {
      light: ['accent', 550],
      dark: ['accent', 600],
    },
    'fg-accent': {
      light: ['accent', 500],
      dark: ['accent', 550],
    },
    'fg-accentHover': {
      light: ['accent', 550],
      dark: ['accent', 600],
    },
    'bg-neutral': {
      light: ['neutral', 500],
      dark: ['neutral', 550],
    },
    'bg-neutralHover': {
      light: ['neutral', 550],
      dark: ['neutral', 600],
    },
    'fg-base': {
      light: ['neutral', 0],
      dark: ['neutral', 900],
    },
    'fg-separator': {
      light: ['neutral', 925],
      dark: ['neutral', 250],
    },
    'fg-description': {
      light: ['neutral', 300],
      dark: ['neutral', 700],
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
  namespace: 'ch-',
};

export const defaultTheme = {
  colors: {
    ...defaultPhysicalColors,
    ...defaultSemanticColors,
    namespace: 'ch-',
  },
  typography: defaultTypography,
};
