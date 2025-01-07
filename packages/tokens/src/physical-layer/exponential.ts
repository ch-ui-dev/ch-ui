// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  AuditOptions,
  ExponentialSeries,
  PhysicalLayer,
  SemanticValues,
} from '../types';
import { renderPhysicalLayer, RenderTokens } from './render-physical-layer';
import { variableNameFromValue } from '../util';
import { auditPhysicalLayer, AuditTokens } from './audit-physical-layer';

export type ExponentialPhysicalLayer<S extends string = string> =
  //
  PhysicalLayer<S, ExponentialSeries>;

const exponentialNamedResolvedValues = ({
  series,
  seriesId,
  namespace,
  values = [],
  resolvedNaming,
}: Omit<Parameters<RenderTokens<ExponentialSeries>>[0], 'conditionId'>) => {
  const { initial, base, snapTo } = series;
  return values
    .map((value) => {
      const preSnappedValue = initial * Math.pow(base, value);
      if (snapTo) {
        return (
          snapTo.initial +
          snapTo.slope *
            Math[snapTo.method](
              (preSnappedValue - snapTo.initial) / snapTo.slope,
            )
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

export const renderExponentialTokens: RenderTokens<ExponentialSeries> = (
  params,
) =>
  exponentialNamedResolvedValues(params).map(
    ({ resolvedValue, variableName }) => {
      return `${variableName}: ${resolvedValue.toFixed(3)}${
        params.series.unit
      };`;
    },
  );

export const renderExponentialLayer = (
  layer: ExponentialPhysicalLayer,
  semanticValues?: SemanticValues,
): string =>
  renderPhysicalLayer<ExponentialPhysicalLayer, ExponentialSeries>(
    layer,
    renderExponentialTokens,
    semanticValues,
  );

export const auditExponentialTokens: AuditTokens<ExponentialSeries> = ({
  values,
  ...params
}) =>
  exponentialNamedResolvedValues({
    ...params,
    values: Array.from(values.keys()),
  }).map(({ value, variableName }) => ({
    variableName,
    value,
    seriesId: params.seriesId,
    ...values.get(value)!,
  }));

export const auditExponentialLayer = (
  layer: ExponentialPhysicalLayer,
  auditOptions: AuditOptions,
  semanticValues?: SemanticValues,
) =>
  auditPhysicalLayer<ExponentialPhysicalLayer, ExponentialSeries>(
    layer,
    auditOptions,
    auditExponentialTokens,
    semanticValues,
  );
