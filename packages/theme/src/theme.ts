// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { ColorsPhysicalLayer } from './physical-layer';
import {
  ExponentialSeries,
  HelicalArcSeries,
  LinearSeries,
  SemanticLayer,
} from './types';
import { TypographyTokensConfig } from './facets';

export type ThemeConfig = {
  colors?: ColorsPhysicalLayer & SemanticLayer;
  typography?: TypographyTokensConfig<any>;
};

// DEFAULT THEME VALUES

const neutralArc: HelicalArcSeries = {
  keyPoint: [47, 3.5, 282],
  lowerCp: 0.8,
  upperCp: 0.88,
  torsion: 0,
  keys: {},
};

const accentArc: HelicalArcSeries = {
  keyPoint: [43, 83, 282],
  lowerCp: 0.86,
  upperCp: 1,
  torsion: -30,
  keys: {},
};

export const defaultPhysicalColors: ColorsPhysicalLayer = {
  conditions: {
    srgb: [':root'],
    p3: ['@media (color-gamut: p3)', ':root'],
    rec2020: ['@media (color-gamut: rec2020)', ':root'],
  },
  series: {
    neutral: {
      srgb: neutralArc,
      p3: neutralArc,
      rec2020: neutralArc,
    },
    accent: {
      srgb: accentArc,
      p3: accentArc,
      rec2020: accentArc,
    },
  },
};

export const defaultSemanticColors: SemanticLayer = {
  conditions: {
    light: [':root'],
    dark: ['@media (prefers-color-scheme: dark)', ':root'],
  },
  sememes: {
    'bg-base': {
      light: ['neutral', 0.975],
      dark: ['neutral', 0.15],
    },
    'bg-input': {
      light: ['neutral', 0.95],
      dark: ['neutral', 0.175],
    },
    'bg-hover': {
      light: ['neutral', 0.925],
      dark: ['neutral', 0.2],
    },
    'bg-accent': {
      light: ['accent', 0.5],
      dark: ['accent', 0.55],
    },
    'bg-accentHover': {
      light: ['accent', 0.55],
      dark: ['accent', 0.6],
    },
    'fg-accent': {
      light: ['accent', 0.5],
      dark: ['accent', 0.55],
    },
    'fg-accentHover': {
      light: ['accent', 0.55],
      dark: ['accent', 0.6],
    },
    'bg-neutral': {
      light: ['neutral', 0.5],
      dark: ['neutral', 0.55],
    },
    'bg-neutralHover': {
      light: ['neutral', 0.55],
      dark: ['neutral', 0.6],
    },
    'fg-base': {
      light: ['neutral', 0],
      dark: ['neutral', 0.9],
    },
    'fg-separator': {
      light: ['neutral', 0.925],
      dark: ['neutral', 0.25],
    },
    'fg-description': {
      light: ['neutral', 0.3],
      dark: ['neutral', 0.7],
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

// @ts-ignore
export const defaultTheme: ThemeConfig = {
  colors: {
    ...defaultPhysicalColors,
    ...defaultSemanticColors,
    namespace: 'ch-',
  },
  typography: defaultTypography,
};
