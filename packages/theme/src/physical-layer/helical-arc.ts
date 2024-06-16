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
import { renderCondition, seriesValues, nameFromValue } from '../util';

export type ColorsPhysicalLayer = PhysicalLayer<Gamut, HelicalArcSeries>;

export const renderPhysicalColorTokens = (
  { conditions, series, namespace = '' }: ColorsPhysicalLayer,
  semanticValues?: SemanticValues,
): string => {
  return `${Object.entries(conditions)
    .map(([conditionId, statements]) =>
      renderCondition(
        Object.entries(series)
          .map(([seriesId, { [conditionId as Gamut]: helicalArcSeries }]) => {
            return getOklabVectorsFromLuminosities(
              seriesValues(
                helicalArcSeries!,
                Array.from(semanticValues?.[seriesId] ?? []),
              ),
              constellationFromPalette(helicalArcSeries!),
            )
              .map((oklab) => {
                return `--${namespace}${seriesId}-${nameFromValue(
                  oklab[0],
                  helicalArcSeries?.valueNaming,
                )}: ${oklabVectorToValue(oklab, conditionId as Gamut)};`;
              })
              .join('\n');
          })
          .join('\n\n'),
        0,
        statements,
      ),
    )
    .join('\n\n')}`;
};

export const constellationFromPalette = (
  helicalArcConfig: HelicalArcConfig,
  curveDepth: number = 32,
) =>
  constellationFromHelicalArc(
    helicalArcFromConfig(helicalArcConfig),
    curveDepth,
  );
