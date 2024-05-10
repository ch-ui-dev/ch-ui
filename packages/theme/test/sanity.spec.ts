// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import assert from 'node:assert';
import test from 'node:test';
import { resolve } from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';
import {
  PhysicalColorTokensConfig,
  renderPhysicalColorTokens,
  renderSemanticColorTokens,
} from '../src';
import { SemanticColorTokensConfig } from '../src/semanticColors';

const physicalColorsConfig: PhysicalColorTokensConfig = {
  gamuts: ['P3', 'rec2020'],
  shadeNumbering: 'emissive',
  palettes: {
    primary: {
      keyColor: [43, 81, 282],
      darkCp: 0.86,
      lightCp: 1,
      hueTorsion: -30,
    },
  },
};

const semanticColorsConfig: SemanticColorTokensConfig<
  typeof physicalColorsConfig
> = {
  themes: { light: null, dark: '@media (prefers-color-scheme: dark)' },
  semanticColors: {
    link: {
      light: '--primary-100',
      dark: '--primary-900',
    },
    'link-hover': {
      light: '--primary-50',
      dark: '--primary-850',
    },
  },
};

test('physical and semantic color tokens are generated as expected', async () => {
  const dir = resolve(__dirname, '../tmp');
  await mkdir(resolve(dir), { recursive: true });
  const tokens = `${renderPhysicalColorTokens(
    physicalColorsConfig,
  )}\n\n${renderSemanticColorTokens<typeof physicalColorsConfig>(
    semanticColorsConfig,
  )}`;
  await writeFile(resolve(dir, 'physical.css'), tokens);
});
