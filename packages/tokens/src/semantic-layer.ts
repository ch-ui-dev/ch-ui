// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { SemanticLayer, Statements } from './types';
import { escapeValue, renderCondition } from './util';

export const renderSemanticLayer = <
  K extends string = string,
  S extends string = string,
  V extends number = number,
>({
  conditions,
  sememes,
  namespace = '',
  physicalNamespace,
}: SemanticLayer<K, S, V>): string => {
  return Object.entries(conditions)
    .map(([conditionId, statements]) =>
      renderCondition(
        Object.entries(sememes)
          .map(
            ([
              sememeName,
              {
                [conditionId as K]: [seriesName, value],
              },
            ]) =>
              // TODO(thure): This should almost certainly use `variableNameFromValue`.
              `--${namespace}${sememeName}: var(--${
                physicalNamespace ?? namespace
              }${seriesName}-${escapeValue(`${value}`)});`,
          )
          .join('\n'),
        0,
        statements as Statements,
      ),
    )
    .join('\n\n');
};
