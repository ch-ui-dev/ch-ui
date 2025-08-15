// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import assert from 'node:assert';
import test from 'node:test';
import {
  defaultColorDefs,
  defaultPhysicalColors,
  defaultSemanticColors,
  auditFacet,
} from '../src';

test('audits are generated as expected', async () => {
  const colorAudit = auditFacet(
    {
      definitions: defaultColorDefs,
      physical: defaultPhysicalColors,
      semantic: defaultSemanticColors,
    },
    { condition: 'p3' },
  );
  const accent600 = colorAudit.accent.find(
    ({ variableName }) => variableName === '--ch-accent-600',
  );
  assert.deepEqual(accent600?.semantic, [
    {
      sememeName: 'bg-accentHover',
      originalValue: 600,
      conditionId: 'dark',
    },
    {
      sememeName: 'fg-accentHover',
      originalValue: 600,
      conditionId: 'dark',
    },
  ]);
});
