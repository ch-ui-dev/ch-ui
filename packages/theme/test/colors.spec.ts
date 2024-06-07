// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import assert from 'node:assert';
import test from 'node:test';
import { resolve } from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';
import {
  type PhysicalColorTokensConfig,
  type SemanticColorTokensConfig,
  renderColorTokens,
} from '../src';

const physicalColorsConfig: PhysicalColorTokensConfig = {
  gamuts: ['p3', 'rec2020', 'oklch'],
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
  themes: {
    light: [':root'],
    dark: ['@media (prefers-color-scheme: dark)', ':root'],
  },
  semanticColors: {
    link: {
      light: ['primary', 290],
      dark: ['primary', 820],
    },
    'link-hover': {
      light: ['primary', 120],
      dark: ['primary', 710],
    },
  },
};

test('physical and semantic color tokens are generated as expected', async () => {
  const dir = resolve(__dirname, '../tmp');
  await mkdir(resolve(dir), { recursive: true });
  const tokens = renderColorTokens({
    ...physicalColorsConfig,
    ...semanticColorsConfig,
  });
  await writeFile(resolve(dir, 'colors.css'), tokens);
  assert.equal(
    tokens.includes(
      '@media (prefers-color-scheme: dark) {\n' +
        '  :root {\n' +
        '    --link: var(--primary-820);\n' +
        '    --link-hover: var(--primary-710);',
    ),
    true,
  );
  assert.equal(
    tokens.includes(
      '@media (color-gamut: rec2020) {\n' +
        '  :root {\n' +
        '    --primary-120: color(rec2020 0.00269 0 0.12643);\n' +
        '    --primary-290: color(rec2020 0.02715 0.02338 0.48511);',
    ),
    true,
  );
});
