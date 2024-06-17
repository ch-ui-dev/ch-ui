// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { ExponentialSeries, PhysicalLayer, SemanticValues } from '../types';
import { renderPhysicalLayer, RenderTokens } from './render-physical-layer';
import { nameFromValue } from '../util';

export type ExponentialPhysicalLayer<S extends string = string> =
  //
  PhysicalLayer<S, ExponentialSeries>;

export const renderExponentialTokens: RenderTokens<ExponentialSeries> = ({
  series,
  seriesId,
  namespace,
  values,
  resolvedNaming,
}) => {
  const { initial, base, unit } = series;
  return values
    .map((value) => initial * Math.pow(base, value))
    .map((physicalValue, index) => {
      return `--${namespace}${seriesId}-${nameFromValue(
        values[index],
        resolvedNaming,
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
