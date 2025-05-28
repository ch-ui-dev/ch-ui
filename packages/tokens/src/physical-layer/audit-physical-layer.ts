// Required notice: Copyright (c) 2025, Will Shown <ch-ui@willshown.com>

import {
  AuditOptions,
  AuditTokens,
  Definitions,
  PhysicalLayer,
  SemanticValues,
  Series,
  TokenAudit,
} from '../types';
import { resolveDefinition, resolveNaming, seriesValues } from '../util';

export const auditPhysicalLayer = <
  L extends PhysicalLayer<string, Series<any>>,
  S extends Series<any>,
>(
  { series, namespace = '', definitions: layerDefinitions = {} }: L,
  { condition }: AuditOptions,
  auditTokens: AuditTokens<S>,
  semanticValues?: SemanticValues,
  ...ancestorDefinitions: Definitions[]
): Record<string, TokenAudit[]> => {
  return Object.fromEntries(
    Object.entries(series).map(([seriesId, { [condition]: series }]) => {
      const resolvedSeries = resolveDefinition<S, S>(
        series as S,
        'series',
        () => true,
        layerDefinitions,
        ...ancestorDefinitions,
      );
      const resolvedNaming = resolveNaming(resolvedSeries.naming);
      const values = seriesValues(resolvedSeries, semanticValues?.[seriesId]);
      return [
        seriesId,
        auditTokens(
          {
            seriesId,
            series: resolvedSeries,
            namespace,
            resolvedNaming,
            values,
          },
          layerDefinitions,
          ...ancestorDefinitions,
        ),
      ];
    }),
  );
};
