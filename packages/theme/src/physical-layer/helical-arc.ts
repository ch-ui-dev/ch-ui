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
import { seriesValues, nameFromValue } from '../util';
import { renderPhysicalLayer } from './render-physical-layer';

export type ColorsPhysicalLayer = PhysicalLayer<Gamut, HelicalArcSeries>;

export const renderPhysicalColorTokens = (
  layer: ColorsPhysicalLayer,
  semanticValues?: SemanticValues,
): string => {
  return renderPhysicalLayer(
    layer,
    ({ series, seriesId, conditionId, namespace, semanticValues }) =>
      getOklabVectorsFromLuminosities(
        seriesValues(series!, semanticValues),
        constellationFromPalette(series as HelicalArcSeries),
      ).map((oklab) => {
        return `--${namespace}${seriesId}-${nameFromValue(
          oklab[0],
          series?.valueNaming,
        )}: ${oklabVectorToValue(oklab, conditionId as Gamut)};`;
      }),
    semanticValues,
  );
};

export const constellationFromPalette = (
  helicalArcConfig: HelicalArcConfig,
  curveDepth: number = 32,
) =>
  constellationFromHelicalArc(
    helicalArcFromConfig(helicalArcConfig),
    curveDepth,
  );
