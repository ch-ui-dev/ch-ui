// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { ColorsPhysicalLayer } from './physical-layer';
import {
  Conditions,
  ExponentialSeries,
  LinearSeries,
  ResolvedHelicalArcSeries,
  SemanticLayer,
} from './types';
import { Facet, renderFacet } from './facet';

export type TokenSet = Record<string, Facet>;

// Default token set values

export const defaultColorDefs = {
  accompanyingSeries: {
    emissiveRelation: {
      initial: 0,
      slope: 1000,
      method: 'floor',
    },
  },
  series: {
    neutralArc: {
      keyPoint: [0.47, 0.014, 256],
      lowerCp: 0.8,
      upperCp: 0.88,
      torsion: 0,
      physicalValueRelation: { extends: 'emissiveRelation' },
    } as ResolvedHelicalArcSeries,
    accentArc: {
      keyPoint: [0.43, 0.4, 256],
      lowerCp: 1,
      upperCp: 1,
      torsion: -12,
      physicalValueRelation: { extends: 'emissiveRelation' },
    } as ResolvedHelicalArcSeries,
  },
};

export const defaultPhysicalColors = {
  definitions: defaultColorDefs,
  conditions: {
    srgb: [':root'],
    p3: ['@media (color-gamut: p3)', ':root'],
    rec2020: ['@media (color-gamut: rec2020)', ':root'],
  },
  series: {
    neutral: {
      srgb: { extends: 'neutralArc' },
      p3: { extends: 'neutralArc' },
      rec2020: { extends: 'neutralArc' },
    },
    accent: {
      srgb: { extends: 'accentArc' },
      p3: { extends: 'accentArc' },
      rec2020: { extends: 'accentArc' },
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

const baseCondition = {
  base: [':root'],
} satisfies Conditions;

const defaultGaps = {
  initial: 0.25,
  unit: 'rem',
  base: 2,
  naming: {
    hairline: -2,
    half: -1,
    '1': 0,
    '2': 1,
    '3': 2,
    '4': 3,
    '5': 4,
    '6': 5,
    '7': 6,
    '8': 7,
  },
} satisfies ExponentialSeries;

export const defaultTokenSet = {
  colors: {
    physical: defaultPhysicalColors,
    semantic: defaultSemanticColors,
  },
  fontSizes: {
    physical: {
      conditions: baseCondition,
      series: {
        'text-size': { base: defaultSizes },
      },
      namespace: 'ch-',
    },
  },
  lineHeights: {
    physical: {
      conditions: baseCondition,
      series: {
        'system-leading': { base: defaultLineHeights },
        'prose-leading': { base: proseLineHeights },
      },
      namespace: 'ch-',
    },
  },
  lengths: {
    physical: {
      conditions: baseCondition,
      series: {
        gap: { base: defaultGaps },
      },
      namespace: 'ch-',
    },
  },
} satisfies TokenSet;

export const renderTokenSet = (tokenSet: TokenSet) => {
  return Object.values(tokenSet)
    .map((facet) => renderFacet(facet))
    .join('\n\n');
};
