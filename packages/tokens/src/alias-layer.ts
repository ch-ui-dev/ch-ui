// Required notice: Copyright (c) 2025, Will Shown <ch-ui@willshown.com>

import { AliasLayer, Statements } from './types';
import { renderCondition } from './util';

export const renderAliasLayer = <
  K extends string = string,
  Q extends string = string,
>({
  conditions,
  aliases,
  namespace = '',
  semanticNamespace = namespace,
}: AliasLayer<K, Q>): string => {
  return Object.entries(conditions)
    .map(([conditionId, statements]) =>
      renderCondition(
        (Object.entries(aliases) as [Q, Record<K, string[]>][])
          .filter(([_, sememeAliases]) => sememeAliases[conditionId as K])
          .map(([sememeName, sememeAliases]) => {
            return sememeAliases[conditionId as K]!.map(
              (aliasName) =>
                `--${namespace}${aliasName}: var(--${semanticNamespace}${sememeName});`,
            ).join('\n');
          })
          .join('\n'),
        0,
        statements as Statements,
      ),
    )
    .join('\n\n');
};
