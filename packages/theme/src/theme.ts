// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { ColorsPhysicalLayer } from './physical-layer';
import {
  AccompanyingSeries,
  Conditions,
  ExponentialSeries,
  HelicalArcSeries,
  LinearSeries,
  SemanticLayer,
} from './types';
import { Facet, renderFacet } from './facet';

export type ThemeConfig = Record<string, Facet>;

// DEFAULT THEME VALUES

const emissiveRelation = {
  initial: 0,
  slope: 1000,
  method: 'floor',
} satisfies AccompanyingSeries;

const neutralArc = {
  keyPoint: [0.47, 0.014, 256],
  lowerCp: 0.8,
  upperCp: 0.88,
  torsion: 0,
  physicalValueRelation: emissiveRelation,
} satisfies HelicalArcSeries;

const accentArc = {
  keyPoint: [0.43, 0.4, 256],
  lowerCp: 1,
  upperCp: 1,
  torsion: -12,
  physicalValueRelation: emissiveRelation,
} satisfies HelicalArcSeries;

export const defaultPhysicalColors = {
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
} satisfies ColorsPhysicalLayer;

export const defaultSemanticColors = {
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
} satisfies SemanticLayer;

const defaultWeights = {
  initial: 0,
  slope: 1,
  naming: {
    regular: 400,
    bold: 700,
  },
} satisfies LinearSeries;

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

const defaultSizes = {
  initial: 1,
  unit: 'rem',
  base: 1.2,
  naming: defaultExponentialKeys,
} satisfies ExponentialSeries;

const lineHeightSnapTo = {
  method: 'ceil',
  initial: 0,
  slope: 0.25,
} satisfies ExponentialSeries['snapTo'];

const defaultLineHeights = {
  initial: 1.25,
  unit: 'rem',
  base: defaultSizes.base - 0.05, // <- larger type sizes benefit from less leading
  naming: defaultExponentialKeys,
  snapTo: lineHeightSnapTo,
} satisfies ExponentialSeries;

const proseLineHeights = {
  initial: 1.33,
  unit: 'rem',
  base: defaultSizes.base - 0.03,
  naming: defaultExponentialKeys,
  snapTo: lineHeightSnapTo,
} satisfies ExponentialSeries;

const typographyConditions = {
  base: [':root'],
} satisfies Conditions;

// @ts-ignore
export const defaultTheme = {
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
} satisfies ThemeConfig;

export const renderTheme = (theme: ThemeConfig) => {
  return Object.values(theme)
    .map((facet) => renderFacet(facet))
    .join('\n\n');
};
