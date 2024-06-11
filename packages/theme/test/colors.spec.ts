// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import assert from 'node:assert';
import test from 'node:test';
import { resolve } from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';
import {
  renderColorTokens,
  defaultPhysicalColors,
  defaultSemanticColors,
} from '../src';

test('physical and semantic color tokens are generated as expected', async () => {
  const dir = resolve(__dirname, '../tmp');
  await mkdir(resolve(dir), { recursive: true });
  const tokens = renderColorTokens({
    ...defaultPhysicalColors,
    ...defaultSemanticColors,
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
