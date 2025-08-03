// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  Definitions,
  InvariantCheck,
  PhysicalLayer,
  PhysicalResolvedValueExpressions,
  RenderTokens,
  SemanticValues,
  Series,
  ValueOfSeries,
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
  { conditions, series, namespace = '', definitions: layerDefinitions = {} }: L,
  renderTokens: RenderTokens<ResolvedSeries>,
  invariantCheck: InvariantCheck,
  semanticValues?: SemanticValues,
  ...ancestorDefinitions: Definitions[]
): [string, PhysicalResolvedValueExpressions] => {
  const allResolvedExpressions = new Map<string | number, string>();

  const cssString = `${Object.entries(conditions)
    .map(([conditionId, statements]) =>
      renderCondition(
        Object.entries(series)
          .filter(([_, series]) => series[conditionId])
          .map(([seriesId, { [conditionId]: series }]) => {
            const resolvedSeries = resolveDefinition<S, ResolvedSeries>(
              series as S,
              'series',
              invariantCheck,
              layerDefinitions,
              ...ancestorDefinitions,
            );
            const resolvedNaming = resolveNaming(resolvedSeries.naming);
            const values = Array.from(
              seriesValues(resolvedSeries, semanticValues?.[seriesId]).keys(),
            );
            const [cssDeclarations, resolvedExpressions] = renderTokens(
              {
                seriesId,
                conditionId,
                series: resolvedSeries,
                namespace,
                resolvedNaming,
                values,
                semanticValues,
              },
              new Map<ValueOfSeries<S>, string>(),
              layerDefinitions,
              ...ancestorDefinitions,
            );

            resolvedExpressions.forEach((value, key) => {
              allResolvedExpressions.set(key, value);
            });

            return cssDeclarations.join('\n');
          })
          .join('\n\n'),
        0,
        statements,
      ),
    )
    .join('\n\n')}`;

  return [cssString, allResolvedExpressions];
};
