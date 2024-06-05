// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import assert from 'node:assert';
import test from 'node:test';
import {
  ExponentialSeries,
  LinearSeries,
  renderTypographyTokens,
  TypographyTokensConfig,
} from '../src';
import { resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

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

const typographyConfig: TypographyTokensConfig = {
  themes: { root: [':root'] },
  fonts: {
    body: {
      root: {
        fontFamily: 'sans-serif',
        sizes: defaultSizes,
        lineHeights: defaultLineHeights,
        weights: defaultWeights,
        fontStyles: defaultFontStyles,
      },
    },
  },
};

test('typography tokens are generated as expected', async () => {
  const dir = resolve(__dirname, '../tmp');
  await mkdir(resolve(dir), { recursive: true });
  const tokens = renderTypographyTokens(typographyConfig);
  await writeFile(resolve(dir, 'typography.css'), tokens);
  assert.equal(
    tokens.includes(`  --body-size-s: 0.83rem;
  --body-size-base: 1.00rem;
  --body-size-lg: 1.20rem;`),
    true,
  );
  assert.equal(
    tokens.includes(`  --body-lineHeight-s: 1.08rem;
  --body-lineHeight-base: 1.25rem;
  --body-lineHeight-lg: 1.45rem;`),
    true,
  );
});
