// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  InvariantCheck,
  PhysicalLayer,
  RenderTokens,
  SemanticValues,
  Series,
} from '../types';
import { renderCondition, resolveNaming, seriesValues } from '../util';
import { resolveDefinition } from '../util/resolve-definitions';

export const renderPhysicalLayer = <
  L extends PhysicalLayer<string, Series<any>>,
  S extends Series<any>,
  ResolvedSeries extends S = S,
>(
  { conditions, series, definitions = {}, namespace = '' }: L,
  renderTokens: RenderTokens<ResolvedSeries>,
  invariantCheck: InvariantCheck,
  semanticValues?: SemanticValues,
) => {
  return `${Object.entries(conditions)
    .map(([conditionId, statements]) =>
      renderCondition(
        Object.entries(series)
          .filter(([_, series]) => series[conditionId])
          .map(([seriesId, { [conditionId]: series }]) => {
            const resolvedNaming = resolveNaming(series?.naming);
            const values = Array.from(
              seriesValues(series!, semanticValues?.[seriesId]).keys(),
            );
            const resolvedSeries = resolveDefinition<S, ResolvedSeries>(
              series as S,
              'series',
              invariantCheck,
              definitions,
            );
            return renderTokens({
              seriesId,
              conditionId,
              series: resolvedSeries,
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
