// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import assert from 'node:assert';
import test from 'node:test';
import { defaultTokenSet, renderFacet } from '../src';
import { dirname, resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

test('typography tokens are generated as expected', async () => {
  const dir = resolve(__dirname, '../tmp');
  await mkdir(resolve(dir), { recursive: true });
  const tokens = [
    renderFacet(defaultTokenSet.fontSizes!),
    renderFacet(defaultTokenSet.lineHeights!),
  ].join('\n\n');
  await writeFile(resolve(dir, 'typography.css'), tokens);
  assert.equal(
    tokens.includes(
      '  --ch-text-size-base: 1.000rem;\n' +
        '  --ch-text-size-lg: 1.200rem;\n' +
        '  --ch-text-size-xl: 1.440rem;',
    ),
    true,
  );
  assert.equal(
    tokens.includes(
      '  --ch-system-leading-base: 1.250rem;\n' +
        '  --ch-system-leading-lg: 1.500rem;\n' +
        '  --ch-system-leading-xl: 1.750rem;',
    ),
    true,
  );
});
