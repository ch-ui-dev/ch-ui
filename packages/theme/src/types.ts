// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

/**
 * A group of statements within which to recursively nest a declaration block.
 */
export type Statements = string[] | undefined;

/**
 * A mapping of names to statement groups.
 */
export type ConfigThemes = Record<string, Statements>;

/**
 * A series of values in the theme.
 */
type Series = {
  /**
   * Input values of members of the series as a map of { name -> value }
   */
  keys: Record<string, number>;
  /**
   * The CSS unit to apply to output numbers. The default applied by theme renderers depends on context.
   */
  unit?: string;
  /**
   * A linear series to snap this series’s values to (e.g. when line-height should align to a block-axis grid)
   */
  snapTo?: Omit<LinearSeries, 'keys'> & {
    method: 'floor' | 'ceil' | 'round';
  };
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
