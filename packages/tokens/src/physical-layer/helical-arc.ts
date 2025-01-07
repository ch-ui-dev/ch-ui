// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>
import {
  type HelicalArcConfig,
  type Gamut,
  helicalArcFromConfig,
  constellationFromHelicalArc,
  oklabVectorToValue,
  getOklabVectorsFromLuminosities,
  parseAlphaLuminosity,
} from '@ch-ui/colors';
import {
  AuditOptions,
  HelicalArcSeries,
  PhysicalLayer,
  SemanticValues,
} from '../types';
import { variableNameFromValue, physicalValueFromValueRelation } from '../util';
import { renderPhysicalLayer, RenderTokens } from './render-physical-layer';
import { auditPhysicalLayer, AuditTokens } from './audit-physical-layer';

export type ColorsPhysicalLayer = PhysicalLayer<Gamut, HelicalArcSeries>;

const helicalArcNamedVectors = ({
  series,
  seriesId,
  namespace,
  values = [],
  resolvedNaming,
}: Omit<Parameters<RenderTokens<HelicalArcSeries>>[0], 'conditionId'>) =>
  getOklabVectorsFromLuminosities(
    values.map((value) => {
      const [l] = parseAlphaLuminosity(value);
      return physicalValueFromValueRelation(l, series.physicalValueRelation);
    }),
    constellationFromPalette(series),
  ).map((oklabVector, index) => {
    return {
      value: values[index],
      variableName: variableNameFromValue(
        values[index],
        resolvedNaming,
        seriesId,
        namespace,
      ),
      oklabVector,
    };
  });

export const renderHelicalArcTokens: RenderTokens<HelicalArcSeries> = (
  params,
) => {
  const namedVectors = helicalArcNamedVectors(params);
  return namedVectors.map(({ oklabVector, value, variableName }) => {
    const [_, alpha] = parseAlphaLuminosity(value);
    return `${variableName}: ${oklabVectorToValue(
      oklabVector,
      params.conditionId as Gamut,
      alpha,
    )};`;
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

export const auditHelicalArcTokens: AuditTokens<HelicalArcSeries> = ({
  values,
  ...params
}) =>
  helicalArcNamedVectors({
    ...params,
    values: Array.from(values.keys()),
  }).map(({ value, variableName }) => ({
    variableName,
    value,
    seriesId: params.seriesId,
    ...values.get(value)!,
  }));

export const auditPhysicalColorLayer = (
  layer: ColorsPhysicalLayer,
  auditOptions: AuditOptions,
  semanticValues?: SemanticValues,
) =>
  auditPhysicalLayer<ColorsPhysicalLayer, HelicalArcSeries>(
    layer,
    auditOptions,
    auditHelicalArcTokens,
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
