// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  AccompanyingSeries,
  ResolvedNaming,
  SemanticLayer,
  SemanticValues,
  Series,
} from '../types';

/**
 * Produces all unique values of a series
 */
export const seriesValues = <V = number>(
  { values = [], naming }: Series<V>,
  semanticValues: V[] = [],
): V[] =>
  Array.from(
    new Set([
      ...values,
      ...(naming && typeof naming !== 'string' ? Object.values(naming) : []),
      ...semanticValues,
    ]),
  ).sort();

export const facetSemanticValues = <
  K extends string = string,
  S extends string = string,
  V = number,
>(
  semanticLayer?: SemanticLayer<K, S, V>,
): SemanticValues<S, V> => {
  return semanticLayer
    ? Object.values(semanticLayer.sememes).reduce(
        (acc, sememe) => {
          Object.values(sememe).forEach((sememe) => {
            const [seriesId, value] = sememe as [S, V];
            if (!acc[seriesId]) {
              acc[seriesId] = new Set<V>();
            }
            acc[seriesId].add(value);
          });
          return acc;
        },
        {} as SemanticValues<S, V>,
      )
    : ({} as SemanticValues<S, V>);
};

const defaultRelation: AccompanyingSeries = {
  initial: 0,
  slope: 1,
  method: 'floor',
};

export const physicalValueFromValueRelation = (
  value: number,
  { initial, slope }: AccompanyingSeries = defaultRelation,
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
