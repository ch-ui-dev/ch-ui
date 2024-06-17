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
import {
  physicalValueFromValueRelation,
  seriesValues,
  valueFromPhysicalRelation,
} from '../util';
import { renderPhysicalLayer } from './render-physical-layer';

export type ColorsPhysicalLayer = PhysicalLayer<Gamut, HelicalArcSeries>;

export const renderPhysicalColorTokens = (
  layer: ColorsPhysicalLayer,
  semanticValues?: SemanticValues,
): string => {
  return renderPhysicalLayer<ColorsPhysicalLayer>(
    layer,
    ({ series, seriesId, conditionId, namespace, semanticValues }) => {
      const helicalArcSeries = series as HelicalArcSeries;
      return getOklabVectorsFromLuminosities(
        seriesValues(series!, semanticValues).map((value) =>
          physicalValueFromValueRelation(
            value,
            helicalArcSeries.physicalValueRelation,
          ),
        ),
        constellationFromPalette(helicalArcSeries),
      ).map((oklab) => {
        return `--${namespace}${seriesId}-${valueFromPhysicalRelation(
          oklab[0],
          helicalArcSeries.physicalValueRelation,
        )}: ${oklabVectorToValue(oklab, conditionId as Gamut)};`;
      });
    },
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
