// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { AccompanyingSeries, Series } from '../types';

/**
 * Produces all unique values of a series
 */
export const seriesValues = (
  { values = [] }: Series,
  semanticValues: number[] = [],
): number[] => Array.from(new Set([...values, ...semanticValues])).sort();

export const physicalValueFromValueRelation = (
  value: number,
  { initial, slope }: AccompanyingSeries = defaultRelation,
) => (value - initial) / slope;

const defaultRelation: AccompanyingSeries = {
  initial: 0,
  slope: 1,
  method: 'floor',
};

export const valueFromPhysicalRelation = (
  physicalValue: number,
  { initial, slope, method }: AccompanyingSeries = defaultRelation,
): number => Math[method](physicalValue * slope + initial);
