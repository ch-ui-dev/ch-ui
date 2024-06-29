// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  PhysicalLayer,
  ResolvedNaming,
  SemanticValues,
  Series,
} from '../types';
import { renderCondition, resolveNaming, seriesValues } from '../util';

export type RenderTokens<S extends Series = Series> = (renderProps: {
  seriesId: string;
  conditionId: string;
  series: S;
  namespace?: string;
  resolvedNaming: ResolvedNaming;
  values: number[];
}) => string[];

export const renderPhysicalLayer = <L extends PhysicalLayer, S extends Series>(
  { conditions, series, namespace = '' }: L,
  renderTokens: RenderTokens<S>,
  semanticValues?: SemanticValues,
) => {
  return `${Object.entries(conditions)
    .map(([conditionId, statements]) =>
      renderCondition(
        Object.entries(series)
          .map(([seriesId, { [conditionId]: series }]) => {
            const resolvedNaming = resolveNaming(series?.naming);
            const values = seriesValues(
              series!,
              Array.from(semanticValues?.[seriesId] ?? []),
            );
            return renderTokens({
              seriesId,
              conditionId,
              series: series as S,
              namespace,
              resolvedNaming,
              values,
            }).join('\n');
          })
          .join('\n\n'),
        0,
        statements,
      ),
    )
    .join('\n\n')}`;
};
