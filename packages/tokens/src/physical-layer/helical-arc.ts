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
  AlphaLuminosity,
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
  PhysicalResolvedValueExpressions,
  isValueExpression,
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

const resolveContrastLuminosity = (expression: string): AlphaLuminosity => {
  const [opaqueExpression, alpha] = expression.split(alphaPattern);
  const parts = opaqueExpression.split(':');
  const baseL = parseFloat(parts[parts.length - 1]);
  const result = computeContrast(baseL, ...parts.slice(0, -1).reverse());
  return alpha ? `${result}/${alpha}` : result;
};

const getLastExpressionOperation = (expression: string) =>
  expression.match(/^[^:]*/)?.[0];

const helicalArcNamedVectors = (
  {
    series,
    seriesId,
    namespace,
    values = [],
    semanticValues,
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
      const resolvedValue = isValueExpression(value)
        ? resolveContrastLuminosity(value)
        : value;
      const [l] = parseAlphaLuminosity(resolvedValue);
      return physicalValueFromValueRelation(l, resolvedPhysicalValueRelation);
    }),
    constellationFromPalette(series),
  ).map((oklabVector, index) => {
    const value = values[index];
    const isExpression = isValueExpression(value);
    const lastExpressionOperation = isExpression
      ? getLastExpressionOperation(value) ?? null
      : null;
    const resolvedValue = isExpression
      ? resolveContrastLuminosity(value)
      : value;
    return {
      value: resolvedValue,
      originalValue: semanticValues?.[seriesId]
        .get(value as number)
        ?.find(({ originalValue }) => {
          return originalValue && lastExpressionOperation
            ? getLastExpressionOperation(originalValue.toString()) ===
                lastExpressionOperation
            : true;
        })?.originalValue,
      variableName: variableNameFromValue(
        isExpression
          ? valueNameFromValueRelation(
              oklabVector[0],
              resolvedPhysicalValueRelation,
            )
          : value,
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
  resolvedExpressions,
  ...definitions
) => {
  const namedVectors = helicalArcNamedVectors(params, ...definitions);

  const cssDeclarations = namedVectors.map(
    ({ oklabVector, value, variableName }) => {
      const [_, alpha] = parseAlphaLuminosity(value);
      return `${variableName}: ${oklabVectorToValue(
        oklabVector,
        params.conditionId as Gamut,
        alpha,
      )};`;
    },
  );

  namedVectors.forEach(({ originalValue, variableName }) => {
    if (isValueExpression(originalValue)) {
      resolvedExpressions.set(originalValue, variableName);
    }
  });

  return [cssDeclarations, resolvedExpressions];
};

export const renderPhysicalColorLayer = (
  layer: ColorsPhysicalLayer,
  semanticValues?: SemanticValues,
  ...definitions: Definitions[]
): [string, PhysicalResolvedValueExpressions] =>
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
