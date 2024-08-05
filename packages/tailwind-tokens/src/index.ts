// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  OptionalConfig,
  CustomThemeConfig as TwTheme,
} from 'tailwindcss/types/config';
import {
  TokenSet,
  Facet,
  facetSemanticValues,
  PhysicalLayer,
  SemanticLayer,
  SemanticValues,
  resolveNaming,
  seriesValues,
  variableNameFromValue,
  nameFromValue,
} from '@ch-ui/tokens';

type TwKey = keyof TwTheme;

export type TailwindAdapterFacet = {
  facet: string;
  disposition?: 'extend' | 'overwrite';
  // TODO(thure): This seems dumb, and Tailwind accepts other shapes than 'var(--etc)', how can this be better? Callbacks?
  lineHeightFacet?: string;
};

export type TailwindAdapterConfig = Partial<
  Record<TwKey, TailwindAdapterFacet>
>;

type Mapping = Record<string, string>;

const defaultAdapterConfig = {} satisfies TailwindAdapterConfig;

const renderPhysicalMappings = (
  { conditions, series, namespace }: PhysicalLayer,
  semanticValues?: SemanticValues,
): Mapping =>
  Object.entries(conditions).reduce(
    (acc: Mapping, [conditionId, _statements]) =>
      Object.entries(series).reduce(
        (acc: Mapping, [seriesId, { [conditionId]: series }]) => {
          const resolvedNaming = resolveNaming(series?.naming);
          return seriesValues(
            series!,
            Array.from(semanticValues?.[seriesId] ?? []),
          ).reduce((acc, value) => {
            acc[
              `${seriesId}-${nameFromValue(value, resolvedNaming)}`
            ] = `var(${variableNameFromValue(
              value,
              resolvedNaming,
              seriesId,
              namespace,
            )})`;
            return acc;
          }, acc);
        },
        acc,
      ),
    {},
  );

const renderSemanticMappings = (semantic?: SemanticLayer): Mapping => {
  if (!semantic) {
    return {};
  } else {
    const { conditions, sememes, namespace } = semantic;
    return Object.entries(conditions).reduce(
      (acc: Mapping, [conditionId, statements]) =>
        Object.keys(sememes).reduce((acc: Mapping, sememeName) => {
          acc[sememeName] = `var(--${namespace}${sememeName})`;
          return acc;
        }, acc),
      {},
    );
  }
};

const renderTailwindFacet = ({ physical, semantic }: Facet): Mapping => {
  const semanticValues = facetSemanticValues(semantic);
  // TODO(thure): Need case(s) for Tailwind’s `fontSize`.
  return {
    ...renderPhysicalMappings(physical, semanticValues),
    ...renderSemanticMappings(semantic),
  };
};

export default (
  tokensConfig: TokenSet,
  adapterConfig: TailwindAdapterConfig = defaultAdapterConfig,
): OptionalConfig['theme'] =>
  Object.entries(adapterConfig).reduce(
    (acc: OptionalConfig['theme'], entry) => {
      const [twKey, config] = entry as [TwKey, TailwindAdapterFacet];
      if (config.facet in tokensConfig) {
        const twFacet = renderTailwindFacet(tokensConfig[config.facet]);
        acc[twKey] =
          config.disposition === 'overwrite' ? twFacet : { extend: twFacet };
      }
      return acc;
    },
    {},
  );
