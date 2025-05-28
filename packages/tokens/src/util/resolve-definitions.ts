// Required notice: Copyright (c) 2025, Will Shown <ch-ui@willshown.com>

import {
  AccompanyingSeries,
  Definitions,
  InvariantCheck,
  ResolvedAccompanyingSeries,
  Series,
} from '../types';
import invariant from 'invariant';

const resolveDefinitionImpl = <Definition extends { extends?: string } = any>(
  target: Definition,
  typeKey: string,
  ...definitions: Definitions[]
): Definition => {
  if (!target.extends) {
    return target;
  } else {
    const source =
      definitions.find(
        ({ [typeKey]: typeDefinitions = {} }) =>
          target.extends! in typeDefinitions,
      )?.[typeKey]?.[target.extends] ?? {};
    return {
      ...resolveDefinitionImpl(source, typeKey, ...definitions),
      ...target,
    };
  }
};

export const resolveDefinition = <
  Definition extends { extends?: string } = any,
  ResolvedDefinition extends Definition = any,
>(
  target: Definition,
  typeKey: string,
  invariantCheck: InvariantCheck,
  ...definitions: Definitions[]
): ResolvedDefinition => {
  const resolvedDefinition = resolveDefinitionImpl(
    target,
    typeKey,
    ...definitions,
  );
  invariant(
    invariantCheck(resolvedDefinition),
    `Definition ${target.extends} could not be resolved.`,
  );
  return resolvedDefinition as ResolvedDefinition;
};

export const resolveAccompanyingSeries = (
  target: AccompanyingSeries,
  ...definitions: Definitions[]
): ResolvedAccompanyingSeries => {
  return resolveDefinition<AccompanyingSeries, ResolvedAccompanyingSeries>(
    target,
    'accompanyingSeries',
    ({ initial, slope, method }) =>
      Number.isFinite(initial) &&
      Number.isFinite(slope) &&
      typeof method === 'string',
    ...definitions,
  );
};
