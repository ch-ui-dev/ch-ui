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
import {
  AliasLayer,
  AuditOptions,
  PhysicalLayer,
  SemanticLayer,
  SemanticValues,
  Series,
  ValueOfSeries,
} from './types';
import { facetSemanticValues } from './util';
import { renderSemanticLayer } from './semantic-layer';
import { renderAliasLayer } from './alias-layer';

export type Facet<
  K extends string = string,
  P extends string = string,
  L extends PhysicalLayer<string, Series<any>> =
    | ExponentialPhysicalLayer<P>
    | LinearPhysicalLayer<P>
    | ColorsPhysicalLayer,
  Q extends string = string,
> = {
  physical: L;
  semantic?: SemanticLayer<K, P, ValueOfSeries<L['series']>, Q>;
  alias?: AliasLayer<Q>;
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

export const renderFacet = ({ physical, semantic, alias }: Facet) => {
  const semanticValues = facetSemanticValues(semantic) as SemanticValues;
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
    ...(alias ? [renderAliasLayer(alias)] : []),
  ].join('\n\n');
};

export const auditFacet = (
  { physical, semantic }: Facet,
  auditOptions: AuditOptions,
) => {
  const semanticValues = facetSemanticValues(semantic) as SemanticValues;
  const firstSeries = getFirstSeriesInPhysicalLayer(physical);
  return isColorPhysicalLayer(physical, firstSeries)
    ? auditPhysicalColorLayer(physical, auditOptions, semanticValues)
    : isExponentialLayer(physical, firstSeries)
    ? auditExponentialLayer(physical, auditOptions, semanticValues)
    : auditLinearLayer(physical, auditOptions, semanticValues);
};
