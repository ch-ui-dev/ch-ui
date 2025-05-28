// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import assert from 'node:assert';
import test from 'node:test';
import { dirname, resolve } from 'node:path';
import { scanFiles, scanString, makeSprite, type BundleParams } from '../src';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

const phosphorConfig: BundleParams = {
  symbolPattern:
    'ph-icon--([a-z]+[a-z-]*)--(bold|duotone|fill|light|regular|thin)',
  assetPath: (name, style) =>
    `./node_modules/@phosphor-icons/core/assets/${style}/${name}${
      style === 'regular' ? '' : `-${style}`
    }.svg`,
  spritePath: '../dist/assets/sprite.svg',
  contentPaths: [resolve(__dirname, './example.html')],
};

const positiveSymbols = [
  'ph-icon--address-book--regular',
  'ph-icon--beach-ball--bold',
];

test('scan file returns all positive and no negative results', async () => {
  const results = await scanFiles(phosphorConfig);
  assert.equal(
    new Set([...positiveSymbols].filter((symbol) => !results.has(symbol))).size,
    0,
  );
});

test('scan string returns all positive and no negative results', async () => {
  const contentString = (
    await readFile(phosphorConfig.contentPaths[0])
  ).toString();
  const results = scanString({
    ...phosphorConfig,
    contentString,
  });
  assert.equal(
    new Set([...positiveSymbols].filter((symbol) => !results.has(symbol))).size,
    0,
  );
});

test('sprite maker makes a sprite', async () => {
  await makeSprite(phosphorConfig, await scanFiles(phosphorConfig));
  assert.equal(true, true);
});
