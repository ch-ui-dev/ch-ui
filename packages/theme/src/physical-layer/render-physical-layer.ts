// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { PhysicalLayer, SemanticValues, Series } from '../types';
import { renderCondition } from '../util';
import { Gamut } from '@ch-ui/colors/dist/types/src';

export type RenderTokens = (renderProps: {
  seriesId: string;
  conditionId: string;
  series: Series;
  namespace?: string;
  semanticValues?: number[];
}) => string[];

// TODO(thure): Type this so consumers don’t need `as` to narrow the Series so often.

export const renderPhysicalLayer = <L extends PhysicalLayer>(
  { conditions, series, namespace = '' }: L,
  renderTokens: RenderTokens,
  semanticValues?: SemanticValues,
) => {
  return `${Object.entries(conditions)
    .map(([conditionId, statements]) =>
      renderCondition(
        Object.entries(series)
          .map(([seriesId, { [conditionId as Gamut]: series }]) => {
            return renderTokens({
              seriesId,
              conditionId,
              series: series!,
              namespace,
              semanticValues: Array.from(semanticValues?.[seriesId] ?? []),
            }).join('\n');
          })
          .join('\n\n'),
        0,
        statements,
      ),
    )
    .join('\n\n')}`;
};
