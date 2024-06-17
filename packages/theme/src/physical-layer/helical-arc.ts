// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>
import {
  type HelicalArcConfig,
  type Gamut,
  helicalArcFromConfig,
  constellationFromHelicalArc,
  oklabVectorToValue,
  getOklabVectorsFromLuminosities,
} from '@ch-ui/colors';
import { HelicalArcSeries, PhysicalLayer, SemanticValues } from '../types';
import { nameFromValue, physicalValueFromValueRelation } from '../util';
import { renderPhysicalLayer, RenderTokens } from './render-physical-layer';

export type ColorsPhysicalLayer = PhysicalLayer<Gamut, HelicalArcSeries>;

export const renderHelicalArcTokens: RenderTokens<HelicalArcSeries> = ({
  series,
  seriesId,
  conditionId,
  namespace,
  values,
  resolvedNaming,
}) => {
  const oklabVectors = getOklabVectorsFromLuminosities(
    values.map((value) =>
      physicalValueFromValueRelation(value, series.physicalValueRelation),
    ),
    constellationFromPalette(series),
  );
  return oklabVectors.map((oklab, index) => {
    return `--${namespace}${seriesId}-${nameFromValue(
      values[index],
      resolvedNaming,
    )}: ${oklabVectorToValue(oklab, conditionId as Gamut)};`;
  });
};

export const renderPhysicalColorLayer = (
  layer: ColorsPhysicalLayer,
  semanticValues?: SemanticValues,
): string =>
  renderPhysicalLayer<ColorsPhysicalLayer, HelicalArcSeries>(
    layer,
    renderHelicalArcTokens,
    semanticValues,
  );

export const constellationFromPalette = (
  helicalArcConfig: HelicalArcConfig,
  curveDepth: number = 32,
) =>
  constellationFromHelicalArc(
    helicalArcFromConfig(helicalArcConfig),
    curveDepth,
  );
