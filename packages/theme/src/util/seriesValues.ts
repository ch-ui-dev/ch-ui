// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { Series } from '../types';

/**
 * Produces all unique values of a series
 */
export const seriesValues = ({ keys = {}, values = [] }: Series): number[] =>
  Array.from(new Set([...values, ...Object.values(keys)])).sort();
