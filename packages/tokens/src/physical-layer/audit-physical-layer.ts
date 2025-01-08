// Required notice: Copyright (c) 2025, Will Shown <ch-ui@willshown.com>

import {
  AuditOptions,
  AuditTokens,
  PhysicalLayer,
  SemanticValues,
  Series,
  TokenAudit,
} from '../types';
import { resolveNaming, seriesValues } from '../util';

export const auditPhysicalLayer = <
  L extends PhysicalLayer<string, Series<any>>,
  S extends Series<any>,
>(
  { series, namespace = '' }: L,
  { condition }: AuditOptions,
  auditTokens: AuditTokens<S>,
  semanticValues?: SemanticValues,
): Record<string, TokenAudit[]> => {
  return Object.fromEntries(
    Object.entries(series).map(([seriesId, { [condition]: series }]) => {
      const resolvedNaming = resolveNaming(series?.naming);
      const values = seriesValues(series!, semanticValues?.[seriesId]);
      return [
        seriesId,
        auditTokens({
          seriesId,
          series: series as S,
          namespace,
          resolvedNaming,
          values,
        }),
      ];
    }),
  );
};
