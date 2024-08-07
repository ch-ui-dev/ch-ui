// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import assert from 'node:assert';
import test from 'node:test';

import { defaultTokenSet } from '@ch-ui/tokens';
import { TailwindAdapterConfig, default as mapper } from '../src';

const testConfig: TailwindAdapterConfig = {
  colors: {
    facet: 'colors',
    disposition: 'overwrite',
  },
};

test('mapper returns valid tailwind theme extension partial', async () => {
  const result = mapper(defaultTokenSet, testConfig);
  // console.log(result);
  assert.equal(
    (result.colors as Record<string, string>)['fg-base'],
    'var(--ch-fg-base)',
  );
});
