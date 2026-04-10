// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import assert from 'node:assert';
import test from 'node:test';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateIcons } from '../src/validate';

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

const symbolPattern =
  'ph--([a-z]+[a-z-]*)--(bold|duotone|fill|light|regular|thin)';

const assetPath = (name: string, variant: string) =>
  resolve(
    __dirname,
    `../../icons/node_modules/@phosphor-icons/core/assets/${variant}/${name}${
      variant === 'regular' ? '' : `-${variant}`
    }.svg`,
  );

test('validates icons in content files with no missing assets', () => {
  const result = validateIcons({
    symbolPattern,
    assetPath,
    contentPaths: [resolve(__dirname, '../src/icons.stories.ts')],
  });

  assert.ok(result.symbols.size > 0, 'should detect at least one symbol');
  assert.equal(
    result.missing.length,
    0,
    `expected no missing assets but found: ${result.missing
      .map((m) => `${m.symbol} -> ${m.expectedPath}`)
      .join(', ')}`,
  );
});

test('reports missing assets when asset path is wrong', () => {
  const result = validateIcons({
    symbolPattern,
    assetPath: (name, variant) =>
      resolve(__dirname, `./nonexistent/${variant}/${name}.svg`),
    contentPaths: [resolve(__dirname, '../src/icons.stories.ts')],
  });

  assert.ok(result.symbols.size > 0, 'should detect at least one symbol');
  assert.equal(
    result.missing.length,
    result.symbols.size,
    'all symbols should be missing when asset path is wrong',
  );
  for (const entry of result.missing) {
    assert.ok(entry.symbol, 'missing entry should have a symbol');
    assert.ok(entry.expectedPath, 'missing entry should have an expectedPath');
  }
});

test('returns empty results when no content files match', () => {
  const result = validateIcons({
    symbolPattern,
    assetPath,
    contentPaths: [resolve(__dirname, './nonexistent-glob-*.ts')],
  });

  assert.equal(result.symbols.size, 0, 'should detect no symbols');
  assert.equal(result.missing.length, 0, 'should have no missing assets');
});
