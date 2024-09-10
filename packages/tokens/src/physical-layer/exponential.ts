// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { ExponentialSeries, PhysicalLayer, SemanticValues } from '../types';
import { renderPhysicalLayer, RenderTokens } from './render-physical-layer';
import { variableNameFromValue } from '../util';

export type ExponentialPhysicalLayer<S extends string = string> =
  //
  PhysicalLayer<S, ExponentialSeries>;

export const renderExponentialTokens: RenderTokens<ExponentialSeries> = ({
  series,
  seriesId,
  namespace,
  values = [],
  resolvedNaming,
}) => {
  const { initial, base, unit = '', snapTo } = series;
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
    .map((physicalValue, index) => {
      return `${variableNameFromValue(
        values[index],
        resolvedNaming,
        seriesId,
        namespace,
      )}: ${physicalValue.toFixed(3)}${unit};`;
    });
};

export const renderExponentialLayer = (
  layer: ExponentialPhysicalLayer,
  semanticValues?: SemanticValues,
): string =>
  renderPhysicalLayer<ExponentialPhysicalLayer, ExponentialSeries>(
    layer,
    renderExponentialTokens,
    semanticValues,
  );
