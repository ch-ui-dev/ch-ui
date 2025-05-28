// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  AuditOptions,
  ExponentialSeries,
  PhysicalLayer,
  RenderTokensParams,
  SemanticValues,
  AuditTokens,
  RenderTokens,
  ResolvedExponentialSeries,
  Definitions,
} from '../types';
import { renderPhysicalLayer } from './render-physical-layer';
import { variableNameFromValue, resolveAccompanyingSeries } from '../util';
import { auditPhysicalLayer } from './audit-physical-layer';
import invariant from 'invariant';

export type ExponentialPhysicalLayer<S extends string = string> =
  //
  PhysicalLayer<S, ExponentialSeries>;

const exponentialSeriesCheck = (
  resolvedSeries: any,
): resolvedSeries is ExponentialSeries => {
  return (
    Number.isFinite(resolvedSeries.initial) &&
    Number.isFinite(resolvedSeries.base)
  );
};

const exponentialNamedResolvedValues = (
  {
    series,
    seriesId,
    namespace,
    values = [],
    resolvedNaming,
  }: Omit<RenderTokensParams<ResolvedExponentialSeries>, 'conditionId'>,
  ...definitions: Definitions[]
) => {
  const { initial, base, snapTo } = series;
  invariant(
    initial && base,
    `Series ${seriesId} values could not be resolved.`,
  );
  return values
    .map((value) => {
      const preSnappedValue = initial * Math.pow(base, value);
      if (snapTo) {
        const { initial, slope, method } = resolveAccompanyingSeries(
          snapTo,
          ...definitions,
        );
        return (
          initial + slope * Math[method]((preSnappedValue - initial) / slope)
        );
      } else {
        return preSnappedValue;
      }
    })
    .map((resolvedValue, index) => {
      return {
        value: values[index],
        variableName: variableNameFromValue(
          values[index],
          resolvedNaming,
          seriesId,
          namespace,
        ),
        resolvedValue,
      };
    });
};

export const renderExponentialTokens: RenderTokens<
  ResolvedExponentialSeries
> = (params, ...definitions) =>
  exponentialNamedResolvedValues(params, ...definitions).map(
    ({ resolvedValue, variableName }) => {
      return `${variableName}: ${resolvedValue.toFixed(3)}${
        params.series.unit
      };`;
    },
  );

export const renderExponentialLayer = (
  layer: ExponentialPhysicalLayer,
  semanticValues?: SemanticValues,
  ...definitions: Definitions[]
): string =>
  renderPhysicalLayer<
    ExponentialPhysicalLayer,
    ExponentialSeries,
    ResolvedExponentialSeries
  >(
    layer,
    renderExponentialTokens,
    exponentialSeriesCheck,
    semanticValues,
    ...definitions,
  );

export const auditExponentialTokens: AuditTokens<ResolvedExponentialSeries> = (
  { values, ...params },
  ...definitions: Definitions[]
) =>
  exponentialNamedResolvedValues(
    {
      ...params,
      values: Array.from(values.keys()),
    },
    ...definitions,
  ).map(({ value, variableName }) => ({
    variableName,
    value,
    seriesId: params.seriesId,
    ...values.get(value)!,
  }));

export const auditExponentialLayer = (
  layer: ExponentialPhysicalLayer,
  auditOptions: AuditOptions,
  semanticValues?: SemanticValues,
  ...definitions: Definitions[]
) =>
  auditPhysicalLayer<ExponentialPhysicalLayer, ResolvedExponentialSeries>(
    layer,
    auditOptions,
    auditExponentialTokens,
    semanticValues,
    ...definitions,
  );
