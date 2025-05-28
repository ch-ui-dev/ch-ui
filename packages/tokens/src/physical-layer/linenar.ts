// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  AuditOptions,
  LinearSeries,
  PhysicalLayer,
  RenderTokensParams,
  SemanticValues,
  RenderTokens,
  AuditTokens,
  ResolvedLinearSeries,
  Definitions,
} from '../types';
import { renderPhysicalLayer } from './render-physical-layer';
import { variableNameFromValue } from '../util';
import { auditPhysicalLayer } from './audit-physical-layer';

export type LinearPhysicalLayer<S extends string = string> =
  //
  PhysicalLayer<S, LinearSeries>;

const checkLinearSeries = (
  resolvedSeries: any,
): resolvedSeries is LinearSeries => {
  return (
    Number.isFinite(resolvedSeries.initial) &&
    Number.isFinite(resolvedSeries.slope)
  );
};

const linearNamedResolvedValues = (
  {
    series,
    seriesId,
    namespace,
    values = [],
    resolvedNaming,
  }: Omit<RenderTokensParams<ResolvedLinearSeries>, 'conditionId'>,
  ...definitions: Definitions[]
) => {
  const { initial, slope } = series;
  return values
    .map((value) => initial + slope * value)
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

export const renderLinearTokens: RenderTokens<ResolvedLinearSeries> = (
  params,
  ...definitions
) =>
  linearNamedResolvedValues(params, ...definitions).map(
    ({ variableName, resolvedValue }) => {
      return `${variableName}: ${resolvedValue.toFixed(3)}${
        params.series.unit
      };`;
    },
  );

export const renderLinearLayer = (
  layer: LinearPhysicalLayer,
  semanticValues?: SemanticValues,
  ...definitions: Definitions[]
): string =>
  renderPhysicalLayer<LinearPhysicalLayer, LinearSeries, ResolvedLinearSeries>(
    layer,
    renderLinearTokens,
    checkLinearSeries,
    semanticValues,
    ...definitions,
  );

export const auditLinearTokens: AuditTokens<ResolvedLinearSeries> = (
  { values, ...params },
  ...definitions: Definitions[]
) =>
  linearNamedResolvedValues(
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

export const auditLinearLayer = (
  layer: LinearPhysicalLayer,
  auditOptions: AuditOptions,
  semanticValues?: SemanticValues,
  ...definitions: Definitions[]
) =>
  auditPhysicalLayer<LinearPhysicalLayer, ResolvedLinearSeries>(
    layer,
    auditOptions,
    auditLinearTokens,
    semanticValues,
    ...definitions,
  );
