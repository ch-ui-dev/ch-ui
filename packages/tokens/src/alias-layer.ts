// Required notice: Copyright (c) 2025, Will Shown <ch-ui@willshown.com>

import { AliasLayer } from './types';
import { renderCondition } from './util';

export const renderAliasLayer = <Q extends string = string>({
  aliases,
  namespace = '',
  semanticNamespace = namespace,
  statements = [':root'],
}: AliasLayer<Q>): string => {
  return renderCondition(
    (Object.entries(aliases) as [Q, (typeof aliases)[Q]][])
      .map(([sememeName, sememeAliases]) =>
        sememeAliases
          .map(
            (aliasName) =>
              `--${namespace}${aliasName}: var(--${semanticNamespace}${sememeName});`,
          )
          .join('\n'),
      )
      .join('\n\n'),
    0,
    statements,
  );
};
