// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { AccompanyingSeries, ResolvedNaming, Series } from '../types';

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
