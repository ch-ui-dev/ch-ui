// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  ColorsPhysicalLayer,
  ExponentialPhysicalLayer,
  LinearPhysicalLayer,
  renderExponentialLayer,
  renderLinearLayer,
  renderPhysicalColorLayer,
} from './physical-layer';
import { PhysicalLayer, SemanticLayer, Series } from './types';
import { facetSemanticValues } from './util';
import { renderSemanticLayer } from './semantic-layer';

export type Facet<
  K extends string = string,
  S extends string = string,
  L extends PhysicalLayer =
    | ExponentialPhysicalLayer<S>
    | LinearPhysicalLayer<S>
    | ColorsPhysicalLayer,
> = {
  physical: L;
  semantic?: SemanticLayer<K, S>;
};

export const isColorPhysicalLayer = (
  layer: PhysicalLayer,
  firstSeriesInLayer: Series,
): layer is ColorsPhysicalLayer => {
  return 'keyPoint' in firstSeriesInLayer;
};

export const isExponentialLayer = (
  layer: PhysicalLayer,
  firstSeriesInLayer: Series,
): layer is ExponentialPhysicalLayer => {
  return 'base' in firstSeriesInLayer;
};

export const isLinearLayer = (
  layer: PhysicalLayer,
  firstSeriesInLayer: Series,
): layer is LinearPhysicalLayer => {
  return 'slope' in firstSeriesInLayer;
};

const getFirstSeriesInPhysicalLayer = (layer: PhysicalLayer): Series => {
  const seriesIds = Object.keys(layer.series);
  const conditionIds = Object.keys(layer.series[seriesIds[0]]);
  return layer.series[seriesIds[0]][conditionIds[0]]!;
};

export const renderFacet = ({ physical, semantic }: Facet) => {
  const semanticValues = facetSemanticValues(semantic);
  const firstSeries = getFirstSeriesInPhysicalLayer(physical);
  return [
    isColorPhysicalLayer(physical, firstSeries)
      ? renderPhysicalColorLayer(physical, semanticValues)
      : isExponentialLayer(physical, firstSeries)
      ? renderExponentialLayer(physical, semanticValues)
      : isLinearLayer(physical, firstSeries)
      ? renderLinearLayer(physical, semanticValues)
      : '/* Invalid physical layer */',
    ...(semantic ? [renderSemanticLayer(semantic)] : []),
  ].join('\n\n');
};
