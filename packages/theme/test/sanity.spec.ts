// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import assert from 'node:assert';
import test from 'node:test';
import { resolve } from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';
import { renderPhysicalColorTokens } from '../src';

test('physical color tokens are generated as expected', async () => {
  const dir = resolve(__dirname, '../tmp');
  await mkdir(resolve(dir), { recursive: true });
  const tokens = renderPhysicalColorTokens({
    gamuts: ['rec2020', 'P3'],
    shadeNumbering: 'emissive',
    palettes: {
      primary: {
        keyColor: [43, 81, 282],
        darkCp: 0.86,
        lightCp: 1,
        hueTorsion: -30,
      },
    },
  });
  await writeFile(resolve(dir, 'physical.css'), tokens);
});
