// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import assert from 'node:assert';
import test from 'node:test';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFile, mkdir } from 'node:fs/promises';
import {
  defaultPhysicalColors,
  defaultSemanticColors,
  renderFacet,
} from '../src';

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

test('physical, semantic, and alias color tokens are generated as expected', async () => {
  const dir = resolve(__dirname, '../tmp');
  await mkdir(resolve(dir), { recursive: true });
  const tokens = renderFacet({
    physical: defaultPhysicalColors,
    semantic: defaultSemanticColors,
    alias: {
      conditions: { root: [':root'], attention: ['.attention:focus-within'] },
      aliases: {
        'bg-base': {
          root: ['bg-html', 'bg-body'],
          attention: ['bg-html', 'bg-body'],
        },
      },
      namespace: 'ch-',
    },
  });
  await writeFile(resolve(dir, 'colors.css'), tokens);
  assert.equal(
    tokens.includes(
      '@media (prefers-color-scheme: dark) {\n' +
        '  :root {\n' +
        '    --ch-bg-base: var(--ch-neutral-150);\n' +
        '    --ch-bg-input: var(--ch-neutral-161);',
    ),
    true,
  );
  assert.equal(
    tokens.includes(
      '@media (color-gamut: rec2020) {\n' +
        '  :root {\n' +
        '    --ch-neutral-207: color(rec2020 0.03576 0.04032 0.05342);\n' +
        '    --ch-neutral-161: color(rec2020 0.01646 0.01893 0.02622);\n' +
        '    --ch-neutral-0: color(rec2020 0 0 0);',
    ),
    true,
  );
  assert.equal(
    tokens.includes(
      ':root {\n' +
        '  --ch-bg-html: var(--ch-bg-base);\n' +
        '  --ch-bg-body: var(--ch-bg-base);',
    ),
    true,
  );
});
