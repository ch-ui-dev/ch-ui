// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { AccompanyingSeries } from '../types';

const defaultNaming: AccompanyingSeries = {
  initial: 0,
  slope: 1,
  method: 'floor',
};

export const nameFromValue = (
  value: number,
  { initial, slope, method }: AccompanyingSeries = defaultNaming,
): string => `${Math[method](value * slope + initial)}`;

export const valueFromName = (
  name: string,
  { initial, slope }: AccompanyingSeries = defaultNaming,
): number => {
  const output = parseInt(name);
  return (output - initial) / slope;
};
