// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import assert from 'node:assert';
import test from 'node:test';
import { resolve } from 'node:path';
import { scanFiles, scanString, makeSprite, type BundleParams } from '../src';
import { readFile } from 'node:fs/promises';

const phosphorConfig: BundleParams = {
  tokenPattern:
    'ph-icon--([a-z]+[a-z-]*)--(bold|duotone|fill|light|regular|thin)',
  assetPath: (name, style) =>
    `../node_modules/@phosphor-icons/core/assets/${style}/${name}${
      style === 'regular' ? '' : `-${style}`
    }.svg`,
  spritePath: '../dist/assets/sprite.svg',
  contentPath: resolve(__dirname, './example.html'),
};

const positiveTokens = [
  'ph-icon--address-book--regular',
  'ph-icon--beach-ball--bold',
];

test('scan file returns all positive and no negative results', async () => {
  const results = await scanFiles(phosphorConfig);
  assert.equal(
    new Set([...positiveTokens].filter((token) => !results.has(token))).size,
    0,
  );
});

test('scan string returns all positive and no negative results', async () => {
  const contentString = (await readFile(phosphorConfig.contentPath)).toString();
  const results = scanString({
    ...phosphorConfig,
    contentString,
  });
  assert.equal(
    new Set([...positiveTokens].filter((token) => !results.has(token))).size,
    0,
  );
});

test('sprite maker makes a sprite', async () => {
  await makeSprite(phosphorConfig, await scanFiles(phosphorConfig));
  assert.equal(true, true);
});
