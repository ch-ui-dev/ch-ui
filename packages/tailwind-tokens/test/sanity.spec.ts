// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import assert from 'node:assert';
import test from 'node:test';

import { defaultTokenSet } from '@ch-ui/tokens';
import { TailwindAdapterConfig, default as mapper } from '../src';

const testConfig: TailwindAdapterConfig = {
  colors: {
    facet: 'colors',
    disposition: 'overwrite',
    tokenization: 'recursive',
  },
  borderWidth: {
    facet: 'lengths',
    disposition: 'extend',
    tokenization: 'keep-series',
    seriesValueSeparator: '/',
  },
  outlineWidth: {
    facet: 'lengths',
    disposition: 'extend',
    tokenization: 'omit-series',
  },
};

test('mapper returns valid tailwind theme extension partial', async () => {
  const result = mapper(
    {
      ...defaultTokenSet,
      colors: {
        ...defaultTokenSet.colors,
        alias: {
          aliases: { 'bg-base': ['bg-html', 'bg-body'] },
          namespace: 'ch-',
        },
      },
    },
    testConfig,
  );
  // console.log(result);
  assert.equal(
    (result.colors as Record<string, string>)['fg-base'],
    'var(--ch-fg-base)',
  );
  assert.equal(
    (result.colors as Record<string, string>)['bg-html'],
    'var(--ch-bg-html)',
  );
  assert.equal(
    (result.extend?.borderWidth as Record<string, string>)['gap/half'],
    'var(--ch-gap-half)',
  );
  assert.equal(
    (result.extend?.outlineWidth as Record<string, string>)['hairline'],
    'var(--ch-gap-hairline)',
  );
});
