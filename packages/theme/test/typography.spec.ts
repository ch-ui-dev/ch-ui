// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import assert from 'node:assert';
import test from 'node:test';
import { defaultTheme, renderTypographyTokens } from '../src';
import { resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

test('typography tokens are generated as expected', async () => {
  const dir = resolve(__dirname, '../tmp');
  await mkdir(resolve(dir), { recursive: true });
  const tokens = renderTypographyTokens(defaultTheme.typography);
  await writeFile(resolve(dir, 'typography.css'), tokens);
  assert.equal(
    tokens.includes(`  --text-size-s: 0.83rem;
  --text-size-base: 1.00rem;
  --text-size-lg: 1.20rem;`),
    true,
  );
  assert.equal(
    tokens.includes(`  --text-lineHeight-s: 1.08rem;
  --text-lineHeight-base: 1.25rem;
  --text-lineHeight-lg: 1.45rem;`),
    true,
  );
});
