// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { type HelicalArcConfig } from '@ch-ui/colors';

export type PhysicalSeries<
  K extends string = string,
  S extends Series = Series,
> = Partial<Record<K, S>>;

export type PhysicalLayer<
  K extends string = string,
  S extends Series = Series,
> = {
  conditions: Conditions<K>;
  series: Record<string, PhysicalSeries<K, S>>;
  namespace?: string;
};

export type SemanticLayer<
  K extends string = string,
  S extends string = string,
  V extends number = number,
> = {
  conditions: Conditions<K>;
  sememes: Record<string, Record<K, [S, V]>>;
  physicalNamespace?: string;
  namespace?: string;
};

export type SemanticValues<
  S extends string = string,
  V extends number = number,
> = Record<S, Set<V>>;

/**
 * A group of statements within which to recursively nest a declaration block.
 */
export type Statements = string[] | undefined;

/**
 * A mapping of names to statement groups.
 */
export type Conditions<K extends string = string> = Partial<
  Record<K, Statements>
>;

export type AccompanyingSeries = Pick<LinearSeries, 'slope' | 'initial'> & {
  method: 'floor' | 'ceil' | 'round';
};

/**
 * A series of physical tokens. A series must have a `keys` or `values`, and may have both.
 */
export type Series = {
  /**
   * The CSS unit to apply to output numbers. The default applied by theme renderers depends on context.
   */
  unit?: string;
  /**
   * A linear series to snap this series values to (e.g. when line-height should align to a block-axis grid)
   */
  snapTo?: AccompanyingSeries;
  /**
   * Values of members of the series
   */
  values?: number[];
  /**
   * Whether to convert values to string directly or name them manually
   */
  naming?: 'toString' | Record<string, number>;
};

/**
 * A series of values in the theme which are linear in nature, e.g. gaps.
 */
export type LinearSeries = Series & {
  /**
   * The value of `b` in the equation `y = ax + b`
   */
  initial: number;
  /**
   * The value of `a` in the equation `y = ax + b`
   */
  slope: number;
};

/**
 * A series of values in the theme which are exponential in nature, e.g. type sizes.
 */
export type ExponentialSeries = Series & {
  /**
   * The value of `a` in the equation `y = a b^x`
   */
  initial: number;
  /**
   * The value of `b` in the equation `y = a b^x`
   */
  base: number;
};

export type HelicalArcSeries = Series &
  HelicalArcConfig & {
    physicalValueRelation: AccompanyingSeries;
  };
