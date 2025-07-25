// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>
import {
  type HelicalArcConfig,
  type Gamut,
  helicalArcFromConfig,
  constellationFromHelicalArc,
  oklabVectorToValue,
  getOklabVectorsFromLuminosities,
  parseAlphaLuminosity,
  alphaPattern,
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
  valueNameFromValueRelation,
} from '../util';
import { renderPhysicalLayer } from './render-physical-layer';
import { auditPhysicalLayer } from './audit-physical-layer';
import { getL } from '@ch-ui/colors';

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

const parseLcArg = (lc: string) => {
  return {
    get:
      lc[lc.length - 1] === 'b' ? ('background' as const) : ('text' as const),
    argL: parseFloat(lc.slice(0, -1)),
  };
};

const computeContrast = (baseL: number, ...LcArgs: string[]): number => {
  const [LcArg, ...LcArgRest] = LcArgs;
  const { argL, get } = parseLcArg(LcArg);
  const result = getL(get, baseL, argL);
  return LcArgRest.length > 0
    ? computeContrast(result, LcArgRest[0], ...LcArgRest.slice(1))
    : result;
};

const resolveContrastLuminosity = (expression: string) => {
  const [opaqueExpression, alpha] = expression.split(alphaPattern);
  const parts = opaqueExpression.split(':');
  const baseL = parseFloat(parts[parts.length - 1]);
  const result = computeContrast(baseL, ...parts.slice(0, -1).reverse());
  return alpha ? `${result}/${alpha}` : result;
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
) => {
  const resolvedPhysicalValueRelation = resolveAccompanyingSeries(
    series.physicalValueRelation,
    ...definitions,
  );
  return getOklabVectorsFromLuminosities(
    values.map((value) => {
      const resolvedValue =
        typeof value === 'string' && value.includes(':')
          ? resolveContrastLuminosity(value)
          : value;
      const [l] = parseAlphaLuminosity(resolvedValue);
      return physicalValueFromValueRelation(l, resolvedPhysicalValueRelation);
    }),
    constellationFromPalette(series),
  ).map((oklabVector, index) => {
    const isExpression =
      typeof values[index] === 'string' &&
      (values[index] as string).includes(':');
    return {
      value: values[index],
      variableName: variableNameFromValue(
        isExpression
          ? valueNameFromValueRelation(
              oklabVector[0],
              resolvedPhysicalValueRelation,
            )
          : values[index],
        resolvedNaming,
        seriesId,
        namespace,
      ),
      oklabVector,
    };
  });
};

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
