// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  SemanticLayer,
  Statements,
  PhysicalResolvedValueExpressions,
  isValueExpression,
} from './types';
import { escapeValue, renderCondition } from './util';

export const renderSemanticLayer = <
  K extends string = string,
  P extends string = string,
  V = number,
  Q extends string = string,
>(
  {
    conditions,
    sememes,
    namespace = '',
    physicalNamespace = namespace,
  }: SemanticLayer<K, P, V, Q>,
  resolvedExpressions?: PhysicalResolvedValueExpressions,
): string => {
  return Object.entries(conditions)
    .map(([conditionId, statements]) =>
      renderCondition(
        (
          Object.entries(sememes) as [
            keyof typeof sememes,
            (typeof sememes)[Q],
          ][]
        )
          .filter(([, sememe]) => sememe[conditionId as K])
          .map(([sememeName, sememe]) => {
            const [seriesName, value] = sememe[conditionId as K]!;
            return isValueExpression(value)
              ? `--${namespace}${sememeName}: var(${resolvedExpressions?.get(
                  value,
                )});`
              : `--${namespace}${sememeName}: var(--${physicalNamespace}${seriesName}-${escapeValue(
                  `${value}`,
                )});`;
          })
          .join('\n'),
        0,
        statements as Statements,
      ),
    )
    .join('\n\n');
};
