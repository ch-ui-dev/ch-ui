// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { ColorsPhysicalLayer } from './physical-layer';
import {
  AccompanyingSeries,
  ExponentialSeries,
  HelicalArcSeries,
  LinearSeries,
  SemanticLayer,
} from './types';
import { Facet, renderFacet } from './facet';

export type ThemeConfig = Record<string, Facet>;

// DEFAULT THEME VALUES

const emissiveRelation: AccompanyingSeries = {
  initial: 0,
  slope: 1000,
  method: 'floor',
};

const neutralArc: HelicalArcSeries = {
  keyPoint: [47, 3.5, 282],
  lowerCp: 0.8,
  upperCp: 0.88,
  torsion: 0,
  physicalValueRelation: emissiveRelation,
};

const accentArc: HelicalArcSeries = {
  keyPoint: [43, 83, 282],
  lowerCp: 0.86,
  upperCp: 1,
  torsion: -30,
  physicalValueRelation: emissiveRelation,
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
  namespace: 'ch-',
};

export const defaultSemanticColors: SemanticLayer = {
  conditions: {
    light: [':root'],
    dark: ['@media (prefers-color-scheme: dark)', ':root'],
  },
  sememes: {
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
  namespace: 'ch-',
};

const defaultWeights: LinearSeries = {
  initial: 0,
  slope: 1,
  naming: {
    regular: 400,
    bold: 700,
  },
};

const defaultExponentialKeys = {
  '2xs': -3,
  xs: -2,
  s: -1,
  base: 0,
  lg: 1,
  xl: 2,
  '2xl': 3,
  '3xl': 4,
  '4xl': 5,
} satisfies ExponentialSeries['naming'];

const defaultSizes: ExponentialSeries = {
  initial: 1,
  unit: 'rem',
  base: 1.2,
  naming: defaultExponentialKeys,
};

const lineHeightSnapTo = {
  method: 'ceil',
  initial: 0,
  slope: 0.25,
} satisfies ExponentialSeries['snapTo'];

const defaultLineHeights: ExponentialSeries = {
  initial: 1.25,
  unit: 'rem',
  base: defaultSizes.base - 0.05, // <- larger type sizes benefit from less leading
  naming: defaultExponentialKeys,
  snapTo: lineHeightSnapTo,
};

const proseLineHeights: ExponentialSeries = {
  initial: 1.33,
  unit: 'rem',
  base: defaultSizes.base - 0.03,
  naming: defaultExponentialKeys,
  snapTo: lineHeightSnapTo,
};

const typographyConditions = {
  base: [':root'],
};

// @ts-ignore
export const defaultTheme: ThemeConfig = {
  colors: {
    physical: defaultPhysicalColors,
    semantic: defaultSemanticColors,
  },
  fontSizes: {
    physical: {
      conditions: typographyConditions,
      series: {
        'text-size': { base: defaultSizes },
      },
      namespace: 'ch-',
    },
  },
  lineHeights: {
    physical: {
      conditions: typographyConditions,
      series: {
        'system-leading': { base: defaultLineHeights },
        'prose-leading': { base: proseLineHeights },
      },
      namespace: 'ch-',
    },
  },
};

export const renderTheme = (theme: ThemeConfig) => {
  return Object.values(theme)
    .map((facet) => renderFacet(facet))
    .join('\n\n');
};
