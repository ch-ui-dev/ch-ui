// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  ResolvedNaming,
  SememeAnnotation,
  SemanticLayer,
  SemanticValues,
  Series,
  FacetAnnotatedValues,
  SemanticAnnotatedValues,
  ResolvedAccompanyingSeries,
} from '../types';

/**
 * Produces all unique values of a series
 */
export const seriesValues = <V = number>(
  { values = [], naming }: Series<V>,
  semanticValues?: SemanticAnnotatedValues<V>,
): FacetAnnotatedValues<V> => {
  const seriesAnnotatedValues = Array.from(
    new Set([
      ...values,
      ...(naming && typeof naming !== 'string' ? Object.values(naming) : []),
      ...(semanticValues ? Array.from(semanticValues.keys()) : []),
    ]),
  )
    .sort()
    .reduce((acc: FacetAnnotatedValues<V>, value) => {
      acc.set(value, { physical: [], semantic: [] });
      return acc;
    }, new Map());
  values.forEach((directValue) => {
    seriesAnnotatedValues.get(directValue)?.physical.push('values');
  });
  if (naming && typeof naming !== 'string') {
    Object.values(naming).forEach((nameValue) => {
      seriesAnnotatedValues.get(nameValue)?.physical.push('naming');
    });
  }
  if (semanticValues) {
    semanticValues.forEach((annotations, value) => {
      seriesAnnotatedValues.get(value)?.semantic.push(...annotations);
    });
  }
  return seriesAnnotatedValues;
};

export const facetSemanticValues = <
  K extends string = string,
  S extends string = string,
  V = number,
>(
  semanticLayer?: SemanticLayer<K, S, V>,
): SemanticValues<S, V> => {
  return semanticLayer
    ? Object.entries(semanticLayer.sememes).reduce(
        (acc, [sememeName, sememe]) => {
          Object.entries(sememe).forEach(([conditionId, sememe]) => {
            const [seriesId, value] = sememe as [S, V];
            const annotation = {
              sememeName,
              conditionId,
            } satisfies SememeAnnotation;
            if (!acc[seriesId]) {
              acc[seriesId] = new Map<V, SememeAnnotation[]>();
            }
            if (acc[seriesId].has(value)) {
              acc[seriesId].get(value)!.push(annotation);
            } else {
              acc[seriesId].set(value, [annotation]);
            }
          });
          return acc;
        },
        {} as SemanticValues<S, V>,
      )
    : ({} as SemanticValues<S, V>);
};

const defaultRelation: ResolvedAccompanyingSeries = {
  initial: 0,
  slope: 1,
  method: 'floor',
};

export const physicalValueFromValueRelation = (
  value: number,
  { initial, slope }: ResolvedAccompanyingSeries = defaultRelation,
) => (value - initial) / slope;

export const resolveNaming = (
  naming: Series['naming'] = 'toString',
): ResolvedNaming =>
  typeof naming === 'string'
    ? 'toString'
    : Object.entries(naming).reduce((acc, [name, value]) => {
        acc.set(value, name);
        return acc;
      }, new Map());

export const escapeValue = (value: string) =>
  value.replace('/', '\\/').replace('.', '\\.');

export const nameFromValue = (
  value: number | string,
  resolvedNaming: ResolvedNaming,
): string => {
  if (
    typeof resolvedNaming === 'string'
      ? resolvedNaming === 'toString'
      : !resolvedNaming.has(value)
  ) {
    return escapeValue(`${value}`);
  } else {
    return (resolvedNaming as Exclude<ResolvedNaming, 'toString'>).get(value)!;
  }
};

export const variableNameFromValue = (
  value: number | string,
  resolvedNaming: ResolvedNaming,
  seriesId: string,
  namespace: string = '',
): string =>
  `--${namespace}${seriesId}-${nameFromValue(value, resolvedNaming)}`;
