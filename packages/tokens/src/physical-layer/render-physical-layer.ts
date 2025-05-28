// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  Definitions,
  InvariantCheck,
  PhysicalLayer,
  RenderTokens,
  SemanticValues,
  Series,
} from '../types';
import {
  renderCondition,
  resolveNaming,
  seriesValues,
  resolveDefinition,
} from '../util';

export const renderPhysicalLayer = <
  L extends PhysicalLayer<string, Series<any>>,
  S extends Series<any>,
  ResolvedSeries extends S = S,
>(
  { conditions, series, definitions = {}, namespace = '' }: L,
  renderTokens: RenderTokens<ResolvedSeries>,
  invariantCheck: InvariantCheck,
  semanticValues?: SemanticValues,
  ...ancestorDefinitions: Definitions[]
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
              ...ancestorDefinitions,
            );
            return renderTokens(
              {
                seriesId,
                conditionId,
                series: resolvedSeries,
                namespace,
                resolvedNaming,
                values,
              },
              definitions,
              ...ancestorDefinitions,
            ).join('\n');
          })
          .join('\n\n'),
        0,
        statements,
      ),
    )
    .join('\n\n')}`;
};
