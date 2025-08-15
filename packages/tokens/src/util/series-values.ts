// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { DepGraph } from 'dependency-graph';
import {
  ResolvedNaming,
  SememeAnnotation,
  SemanticLayer,
  SemanticValues,
  Series,
  FacetAnnotatedValues,
  SemanticAnnotatedValues,
  ResolvedAccompanyingSeries,
  isValueExpression,
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

const semanticGraphNodeKey = (conditionId: string, sememeName: string) =>
  `${conditionId}〜${sememeName}`;

const isDependentValue = (value: any): false | [string, string] => {
  if (isValueExpression(value)) {
    const parts = value.split(':');
    const dependencyOrValue = parts[1];
    if (isNaN(parseFloat(dependencyOrValue))) {
      return parts as [string, string];
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const facetSemanticValues = <
  K extends string = string,
  S extends string = string,
  V = number,
>(
  semanticLayer?: SemanticLayer<K, S, V>,
): SemanticValues<S, V> => {
  if (!semanticLayer) {
    return {} as SemanticValues<S, V>;
  }

  // Temporary storage for values and their metadata
  type ValueMetadata = {
    seriesId: S;
    value: V;
    originalValue?: V;
  } & SememeAnnotation<V>;

  // Create a dependency graph
  const graph = new DepGraph<ValueMetadata>();

  Object.entries(semanticLayer.sememes).forEach(([sememeName, sememe]) => {
    Object.entries(sememe).forEach(([conditionId, sememe]) => {
      const [seriesId, value] = sememe as [S, V];
      const nodeKey = semanticGraphNodeKey(conditionId, sememeName);

      graph.addNode(nodeKey, {
        seriesId,
        value,
        originalValue: value,
        sememeName,
        conditionId,
      });

      const dependsOnSememe = isDependentValue(value);
      dependsOnSememe &&
        graph.addDependency(
          nodeKey,
          semanticGraphNodeKey(conditionId, dependsOnSememe[1]),
        );
    });
  });

  graph.overallOrder().forEach((nodeKey) => {
    const metadata = graph.getNodeData(nodeKey);

    const { value, originalValue, conditionId, ...rest } = metadata;

    const dependsOnSememe = isDependentValue(value);
    if (dependsOnSememe) {
      const { value: dependentValue } = graph.getNodeData(
        semanticGraphNodeKey(conditionId, dependsOnSememe[1]),
      );
      graph.setNodeData(nodeKey, {
        value: `${dependsOnSememe[0]}:${dependentValue}` as V,
        originalValue: value,
        conditionId,
        ...rest,
      });
    }
  });

  return graph.overallOrder().reduce(
    (result, nodeKey) => {
      const metadata = graph.getNodeData(nodeKey);

      const { seriesId, value, ...annotation } = metadata;

      if (!result[seriesId]) {
        result[seriesId] = new Map<V, SememeAnnotation<V>[]>();
      }

      if (result[seriesId].has(value)) {
        result[seriesId].get(value)!.push(annotation);
      } else {
        result[seriesId].set(value, [annotation]);
      }
      return result;
    },
    {} as SemanticValues<S, V>,
  );
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

export const valueNameFromValueRelation = (
  value: number,
  { initial, slope }: ResolvedAccompanyingSeries = defaultRelation,
) => Math.round(value * slope + initial);

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
