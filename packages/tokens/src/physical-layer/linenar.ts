// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  AuditOptions,
  LinearSeries,
  PhysicalLayer,
  RenderTokensParams,
  SemanticValues,
  RenderTokens,
  AuditTokens,
} from '../types';
import { renderPhysicalLayer } from './render-physical-layer';
import { variableNameFromValue } from '../util';
import { auditPhysicalLayer } from './audit-physical-layer';

export type LinearPhysicalLayer<S extends string = string> =
  //
  PhysicalLayer<S, LinearSeries>;

const linearNamedResolvedValues = ({
  series,
  seriesId,
  namespace,
  values = [],
  resolvedNaming,
}: Omit<RenderTokensParams<LinearSeries>, 'conditionId'>) => {
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

export const renderLinearTokens: RenderTokens<LinearSeries> = (params) =>
  linearNamedResolvedValues(params).map(({ variableName, resolvedValue }) => {
    return `${variableName}: ${resolvedValue.toFixed(3)}${params.series.unit};`;
  });

export const renderLinearLayer = (
  layer: LinearPhysicalLayer,
  semanticValues?: SemanticValues,
): string =>
  renderPhysicalLayer<LinearPhysicalLayer, LinearSeries>(
    layer,
    renderLinearTokens,
    semanticValues,
  );

export const auditLinearTokens: AuditTokens<LinearSeries> = ({
  values,
  ...params
}) =>
  linearNamedResolvedValues({
    ...params,
    values: Array.from(values.keys()),
  }).map(({ value, variableName }) => ({
    variableName,
    value,
    seriesId: params.seriesId,
    ...values.get(value)!,
  }));

export const auditLinearLayer = (
  layer: LinearPhysicalLayer,
  auditOptions: AuditOptions,
  semanticValues?: SemanticValues,
) =>
  auditPhysicalLayer<LinearPhysicalLayer, LinearSeries>(
    layer,
    auditOptions,
    auditLinearTokens,
    semanticValues,
  );
