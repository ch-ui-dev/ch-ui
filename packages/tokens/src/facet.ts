// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  ColorsPhysicalLayer,
  ExponentialPhysicalLayer,
  LinearPhysicalLayer,
  renderExponentialLayer,
  renderLinearLayer,
  renderPhysicalColorLayer,
  auditPhysicalColorLayer,
  auditExponentialLayer,
  auditLinearLayer,
} from './physical-layer';
import { AuditOptions, PhysicalLayer, SemanticLayer, Series } from './types';
import { facetSemanticValues } from './util';
import { renderSemanticLayer } from './semantic-layer';

export type Facet<
  K extends string = string,
  S extends string = string,
  L extends PhysicalLayer<string, Series<any>> =
    | ExponentialPhysicalLayer<S>
    | LinearPhysicalLayer<S>
    | ColorsPhysicalLayer,
> = {
  physical: L;
  semantic?: SemanticLayer<K, S, any>;
};

export const isColorPhysicalLayer = (
  layer: PhysicalLayer<string, Series<any>>,
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

export const getFirstSeriesInPhysicalLayer = (
  layer: PhysicalLayer<string, Series<any>>,
): Series => {
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

export const auditFacet = (
  { physical, semantic }: Facet,
  auditOptions: AuditOptions,
) => {
  const semanticValues = facetSemanticValues(semantic);
  const firstSeries = getFirstSeriesInPhysicalLayer(physical);
  return isColorPhysicalLayer(physical, firstSeries)
    ? auditPhysicalColorLayer(physical, auditOptions, semanticValues)
    : isExponentialLayer(physical, firstSeries)
    ? auditExponentialLayer(physical, auditOptions, semanticValues)
    : auditLinearLayer(physical, auditOptions, semanticValues);
};
