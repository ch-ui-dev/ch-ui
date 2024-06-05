// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import assert from 'node:assert';
import test from 'node:test';
import { resolve } from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';
import {
  type PhysicalColorTokensConfig,
  type SemanticColorTokensConfig,
  renderPhysicalColorTokens,
  renderSemanticColorTokens,
} from '../src';

const physicalColorsConfig: PhysicalColorTokensConfig = {
  gamuts: ['p3', 'rec2020'],
  shadeNumbering: 'emissive',
  palettes: {
    primary: {
      luminosities: [50, 100, 850, 900],
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
  themes: {
    light: [':root'],
    dark: ['@media (prefers-color-scheme: dark)', ':root'],
  },
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
  await writeFile(resolve(dir, 'colors.css'), tokens);
  assert.equal(
    tokens.includes(
      '@media (prefers-color-scheme: dark) {\n' +
        '  :root {\n' +
        '    --link: var(--primary-900);\n' +
        '    --link-hover: var(--primary-850);',
    ),
    true,
  );
  assert.equal(
    tokens.includes(
      '@media (color-gamut: rec2020) {\n' +
        '  :root {\n' +
        '    --primary-50: color(rec2020 0.004 0.021 0.176);',
    ),
    true,
  );
});
