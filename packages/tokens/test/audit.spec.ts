// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import assert from 'node:assert';
import test from 'node:test';
import {
  defaultPhysicalColors,
  defaultSemanticColors,
  auditFacet,
} from '../src';

test('audits are generated as expected', async () => {
  const colorAudit = auditFacet(
    {
      physical: defaultPhysicalColors,
      semantic: defaultSemanticColors,
    },
    { condition: 'p3' },
  );
  assert.notEqual(typeof colorAudit, 'string');
  const accent600 =
    typeof colorAudit !== 'string'
      ? colorAudit.accent.find(
          ({ variableName }) => variableName === '--ch-accent-600',
        )
      : undefined;
  assert.deepEqual(accent600?.semantic, [
    {
      sememeName: 'bg-accentHover',
      conditionId: 'dark',
    },
    {
      sememeName: 'fg-accentHover',
      conditionId: 'dark',
    },
  ]);
});
