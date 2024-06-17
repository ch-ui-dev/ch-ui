// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import assert from 'node:assert';
import test from 'node:test';
import { defaultTheme, renderTypographyTokens } from '../src';
import { resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

test('typography tokens are generated as expected', async () => {
  const dir = resolve(__dirname, '../tmp');
  await mkdir(resolve(dir), { recursive: true });
  const tokens = renderTypographyTokens(defaultTheme.typography!);
  await writeFile(resolve(dir, 'typography.css'), tokens);
  assert.equal(
    tokens.includes(
      '  --ch-text-size-base: 1.000rem;\n' +
        '  --ch-text-size-lg: 1.200rem;\n' +
        '  --ch-text-size-xl: 1.440rem;',
    ),
    true,
  );
});
