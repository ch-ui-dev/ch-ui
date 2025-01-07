// Required notice: Copyright (c) 2025, Will Shown <ch-ui@willshown.com>

import {
  AuditOptions,
  FacetAnnotatedValues,
  PhysicalLayer,
  ResolvedNaming,
  SemanticValues,
  SememeAnnotation,
  Series,
} from '../types';
import { resolveNaming, seriesValues } from '../util';

export type TokenAudit<S extends Series<any> = Series> = {
  variableName: string;
  seriesId: string;
  value: NonNullable<S['values']>[number];
  physical: ('values' | 'naming')[];
  semantic: SememeAnnotation[];
};

export type AuditTokens<S extends Series<any> = Series> = (auditProps: {
  seriesId: string;
  series: S;
  namespace?: string;
  resolvedNaming: ResolvedNaming;
  values: FacetAnnotatedValues<NonNullable<S['values']>[number]>;
}) => TokenAudit<S>[];

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
      return auditTokens({
        seriesId,
        series: series as S,
        namespace,
        resolvedNaming,
        values,
      });
    }),
  );
};
