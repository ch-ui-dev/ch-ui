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
  AuditTokens,
  RenderTokensParams,
  RenderTokens,
  ResolvedHelicalArcSeries,
  Definitions,
} from '../types';
import {
  variableNameFromValue,
  physicalValueFromValueRelation,
  resolveAccompanyingSeries,
} from '../util';
import { renderPhysicalLayer } from './render-physical-layer';
import { auditPhysicalLayer } from './audit-physical-layer';

export type ColorsPhysicalLayer = PhysicalLayer<Gamut, HelicalArcSeries>;

const helicalArcSeriesCheck = (
  resolvedSeries: any,
): resolvedSeries is ResolvedHelicalArcSeries => {
  return (
    Array.isArray(resolvedSeries.keyPoint) &&
    Number.isFinite(resolvedSeries.lowerCp) &&
    Number.isFinite(resolvedSeries.upperCp) &&
    Number.isFinite(resolvedSeries.torsion)
  );
};

const helicalArcNamedVectors = (
  {
    series,
    seriesId,
    namespace,
    values = [],
    resolvedNaming,
  }: Omit<RenderTokensParams<ResolvedHelicalArcSeries>, 'conditionId'>,
  ...definitions: Definitions[]
) =>
  getOklabVectorsFromLuminosities(
    values.map((value) => {
      const [l] = parseAlphaLuminosity(value);
      const resolvedPhysicalValueRelation = resolveAccompanyingSeries(
        series.physicalValueRelation,
        ...definitions,
      );
      return physicalValueFromValueRelation(l, resolvedPhysicalValueRelation);
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

export const renderHelicalArcTokens: RenderTokens<ResolvedHelicalArcSeries> = (
  params,
  ...definitions
) =>
  helicalArcNamedVectors(params, ...definitions).map(
    ({ oklabVector, value, variableName }) => {
      const [_, alpha] = parseAlphaLuminosity(value);
      return `${variableName}: ${oklabVectorToValue(
        oklabVector,
        params.conditionId as Gamut,
        alpha,
      )};`;
    },
  );

export const renderPhysicalColorLayer = (
  layer: ColorsPhysicalLayer,
  semanticValues?: SemanticValues,
  ...definitions: Definitions[]
): string =>
  renderPhysicalLayer<
    ColorsPhysicalLayer,
    HelicalArcSeries,
    ResolvedHelicalArcSeries
  >(
    layer,
    renderHelicalArcTokens,
    helicalArcSeriesCheck,
    semanticValues,
    ...definitions,
  );

export const auditHelicalArcTokens: AuditTokens<ResolvedHelicalArcSeries> = (
  { values, ...params },
  ...definitions: Definitions[]
) =>
  helicalArcNamedVectors(
    {
      ...params,
      values: Array.from(values.keys()),
    },
    ...definitions,
  ).map(({ value, variableName }) => ({
    variableName,
    value,
    seriesId: params.seriesId,
    ...values.get(value)!,
  }));

export const auditPhysicalColorLayer = (
  layer: ColorsPhysicalLayer,
  auditOptions: AuditOptions,
  semanticValues?: SemanticValues,
  ...definitions: Definitions[]
) =>
  auditPhysicalLayer<ColorsPhysicalLayer, ResolvedHelicalArcSeries>(
    layer,
    auditOptions,
    auditHelicalArcTokens,
    semanticValues,
    ...definitions,
  );

export const constellationFromPalette = (
  helicalArcConfig: HelicalArcConfig,
  curveDepth: number = 32,
) =>
  constellationFromHelicalArc(
    helicalArcFromConfig(helicalArcConfig),
    curveDepth,
  );

export { parseAlphaLuminosity };
