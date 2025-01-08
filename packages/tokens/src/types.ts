// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { AlphaLuminosity, type HelicalArcConfig } from '@ch-ui/colors';

export { type Gamut } from '@ch-ui/colors';

export type PhysicalSeries<
  K extends string = string,
  S extends Series<any> = Series,
> = Partial<Record<K, S>>;

export type PhysicalLayer<
  K extends string = string,
  S extends Series<any> = Series,
> = {
  conditions: Conditions<K>;
  series: Record<string, PhysicalSeries<K, S>>;
  namespace?: string;
};

export type SemanticLayer<
  K extends string = string,
  S extends string = string,
  V = number,
> = {
  conditions: Conditions<K>;
  sememes: Record<string, Record<K, [S, V]>>;
  physicalNamespace?: string;
  namespace?: string;
};

export type SememeAnnotation = { sememeName: string; conditionId: string };

export type SemanticValues<S extends string = string, V = number> = Record<
  S,
  SemanticAnnotatedValues<V>
>;

export type SemanticAnnotatedValues<V = number> = Map<V, SememeAnnotation[]>;

export type FacetAnnotatedValues<V = number> = Map<
  V,
  { physical: ('values' | 'naming')[]; semantic: SememeAnnotation[] }
>;

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
export type Series<V = number> = {
  /**
   * The CSS unit to apply to output numbers.
   */
  unit?: string;
  /**
   * A linear series to snap this series values to (e.g. when line-height should align to a block-axis grid)
   */
  snapTo?: AccompanyingSeries;
  /**
   * Values of members of the series
   */
  values?: V[];
  /**
   * Whether to convert values to string directly or name them manually
   */
  naming?: 'toString' | Record<string, V>;
};

export type ResolvedNaming = Map<number | string, string> | 'toString';

/**
 * A series of values in the layer which are linear in nature, e.g. gaps.
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
 * A series of values in the layer which are exponential in nature, e.g. type sizes.
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

export type HelicalArcValue = AlphaLuminosity;

/**
 * A series of values in the layer which lay on a helical arc, the shape of a color palette.
 */
export type HelicalArcSeries = Series<HelicalArcValue> &
  HelicalArcConfig & {
    physicalValueRelation: AccompanyingSeries;
  };

/**
 * Options for audit functions.
 */
export type AuditOptions<C extends string = string> = {
  condition: C;
};

/**
 * The type of a series’s values
 */
export type ValueOfSeries<S extends Series<any> = Series> = NonNullable<
  S['values']
>[number];

/**
 * Information about a physical token, including why it was generated.
 */
export type TokenAudit<S extends Series<any> = Series> = {
  variableName: string;
  seriesId: string;
  value: ValueOfSeries<S>;
  physical: ('values' | 'naming')[];
  semantic: SememeAnnotation[];
};

/**
 * Parameters needed to audit a facet of tokens.
 */
export type AuditTokensParams<S extends Series<any> = Series> = {
  seriesId: string;
  series: S;
  namespace?: string;
  resolvedNaming: ResolvedNaming;
  values: FacetAnnotatedValues<ValueOfSeries<S>>;
};

/**
 * The function provided by different physical layer types which produces `TokenAudit`s.
 */
export type AuditTokens<S extends Series<any> = Series> = (
  auditProps: AuditTokensParams<S>,
) => TokenAudit<S>[];

/**
 * Parameters needed to render a facet of tokens.
 */
export type RenderTokensParams<S extends Series<any> = Series> = {
  seriesId: string;
  conditionId: string;
  series: S;
  namespace?: string;
  resolvedNaming: ResolvedNaming;
  values: ValueOfSeries<S>[];
};

/**
 * The function provided by different physical layer types which renders the layer.
 */
export type RenderTokens<S extends Series<any> = Series> = (
  renderProps: RenderTokensParams<S>,
) => string[];
