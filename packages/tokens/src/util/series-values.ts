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
export const seriesValues = (
  { values = [], naming }: Series,
  semanticValues: number[] = [],
): number[] =>
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
  V extends number = number,
>(
  semanticLayer?: SemanticLayer<K, S, V>,
): SemanticValues => {
  return semanticLayer
    ? Object.values(semanticLayer.sememes).reduce(
        (acc: SemanticValues, sememe) => {
          Object.values(sememe).forEach((sememe) => {
            const [seriesId, value] = sememe as [S, V];
            if (!acc[seriesId]) {
              acc[seriesId] = new Set<V>();
            }
            acc[seriesId].add(value);
          });
          return acc;
        },
        {},
      )
    : {};
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

export const nameFromValue = (
  value: number,
  resolvedNaming: ResolvedNaming,
): string => {
  if (
    typeof resolvedNaming === 'string'
      ? resolvedNaming === 'toString'
      : !resolvedNaming.has(value)
  ) {
    return `${value}`;
  } else {
    return (resolvedNaming as Map<number, string>).get(value)!;
  }
};

export const variableNameFromValue = (
  value: number,
  resolvedNaming: ResolvedNaming,
  seriesId: string,
  namespace: string = '',
): string =>
  `--${namespace}${seriesId}-${nameFromValue(value, resolvedNaming)}`;
