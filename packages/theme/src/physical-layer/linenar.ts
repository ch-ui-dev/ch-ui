// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { LinearSeries, PhysicalLayer, SemanticValues } from '../types';
import { renderPhysicalLayer, RenderTokens } from './render-physical-layer';
import { nameFromValue } from '../util';

export type LinearPhysicalLayer<S extends string = string> =
  //
  PhysicalLayer<S, LinearSeries>;

export const renderLinearTokens: RenderTokens<LinearSeries> = ({
  series,
  seriesId,
  namespace,
  values,
  resolvedNaming,
}) => {
  const { initial, slope, unit = '' } = series;
  return values
    .map((value) => initial + slope * value)
    .map((physicalValue, index) => {
      return `--${namespace}${seriesId}-${nameFromValue(
        values[index],
        resolvedNaming,
      )}: ${physicalValue.toFixed(3)}${unit};`;
    });
};

export const renderLinearLayer = (
  layer: LinearPhysicalLayer,
  semanticValues?: SemanticValues,
): string =>
  renderPhysicalLayer<LinearPhysicalLayer, LinearSeries>(
    layer,
    renderLinearTokens,
    semanticValues,
  );
