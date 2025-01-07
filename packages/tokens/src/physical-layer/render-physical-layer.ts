// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  PhysicalLayer,
  ResolvedNaming,
  SemanticValues,
  Series,
} from '../types';
import { renderCondition, resolveNaming, seriesValues } from '../util';

export type RenderTokens<S extends Series<any> = Series> = (renderProps: {
  seriesId: string;
  conditionId: string;
  series: S;
  namespace?: string;
  resolvedNaming: ResolvedNaming;
  values: S['values'];
}) => string[];

export const renderPhysicalLayer = <
  L extends PhysicalLayer<string, Series<any>>,
  S extends Series<any>,
>(
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
            const values = Array.from(
              seriesValues(series!, semanticValues?.[seriesId]).keys(),
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
