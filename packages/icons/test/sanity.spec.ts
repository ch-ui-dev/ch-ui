// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import assert from 'node:assert';
import test from 'node:test';
import { resolve } from 'node:path';
import bundle, { findTokens } from '../src';

const phosphorConfig = {
  source: '@phosphor-icons/core',
  token: 'ph-icon--([a-z]+[a-z-]*)--(bold|duotone|fill|light|regular|thin)',
  path: 'assets/$2/$1.svg',
  content: resolve(__dirname, './example.html'),
};

const positiveTokens = [
  'ph-icon--address-book--regular',
  'ph-icon--beach-ball--bold',
];

test('token finder returns all positive and no negative results', async () => {
  const results = await findTokens(phosphorConfig);
  assert.deepEqual(positiveTokens, results);
});
