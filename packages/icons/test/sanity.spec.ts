// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import assert from 'node:assert';
import test from 'node:test';
import { resolve } from 'node:path';
import { findTokens, makeSprite } from '../src';
import { BundleParams } from '../src/types';

const phosphorConfig: BundleParams = {
  tokenPattern:
    'ph-icon--([a-z]+[a-z-]*)--(bold|duotone|fill|light|regular|thin)',
  getPath: (name, style) =>
    `../node_modules/@phosphor-icons/core/assets/${style}/${name}${
      style === 'regular' ? '' : `-${style}`
    }.svg`,
  spritePath: '../dist/assets/sprite.svg',
  content: resolve(__dirname, './example.html'),
};

const positiveTokens = new Set([
  'ph-icon--address-book--regular',
  'ph-icon--beach-ball--bold',
]);

test('token finder returns all positive and no negative results', async () => {
  const results = await findTokens(phosphorConfig);
  assert.deepEqual(positiveTokens, results);
});

test('sprite maker makes a sprite', async () => {
  await makeSprite(phosphorConfig, await findTokens(phosphorConfig));
  assert.equal(true, true);
});
