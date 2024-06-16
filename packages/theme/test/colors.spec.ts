// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import assert from 'node:assert';
import test from 'node:test';
import { resolve } from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';
import { defaultPhysicalColors, defaultSemanticColors } from '../src';
import { renderColorFacet } from '../src/facets';

test('physical and semantic color tokens are generated as expected', async () => {
  const dir = resolve(__dirname, '../tmp');
  await mkdir(resolve(dir), { recursive: true });
  const tokens = renderColorFacet({
    physical: defaultPhysicalColors,
    semantic: defaultSemanticColors,
  });
  await writeFile(resolve(dir, 'colors.css'), tokens);
  assert.equal(
    tokens.includes(
      '@media (prefers-color-scheme: dark) {\n' +
        '  :root {\n' +
        '    --bg-base: var(--neutral-150);\n' +
        '    --bg-input: var(--neutral-175);',
    ),
    true,
  );
  assert.equal(
    tokens.includes(
      '@media (color-gamut: rec2020) {\n' +
        '  :root {\n' +
        '    --neutral-0: color(rec2020 0 0 0);\n' +
        '    --neutral-150: color(rec2020 0.01484 0.01488 0.01886);\n' +
        '    --neutral-175: color(rec2020 0.0236 0.02367 0.0295);',
    ),
    true,
  );
});
