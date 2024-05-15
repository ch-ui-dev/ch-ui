// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  DefaultLuminosities,
  PhysicalColorTokensConfig,
} from './physicalColors';

/**
 * Mapping theme ids to the wrapping predicate
 */
export type SemanticColorThemes = Record<string, string | null>;

type DefaultThemes = Record<'light' | 'dark', string | null>;

export type SemanticColorTokensConfig<
  /**
   * The physical token config this will draw from
   */
  P extends PhysicalColorTokensConfig,
  /**
   * The map of theme ids to their wrapping predicates
   */
  T extends SemanticColorThemes = DefaultThemes,
  /**
   * Possible values of luminosities from the physical color tokens config.
   * Can provide `string | number` to make fully broad.
   */
  L extends string | number = DefaultLuminosities,
> = {
  themes: T;
  semanticColors: Record<
    string,
    Record<keyof T, `--${P['namespace']}${keyof P['palettes'] & string}-${L}`>
  >;
  namespace?: string;
};

const themeBlock = (predicate: string | null, block: string) => {
  if (predicate) {
    return `${predicate} {\n  :root{\n${block}\n  }\n}`;
  } else {
    return `:root {\n${block}\n}`;
  }
};

export const renderSemanticColorTokens = <
  P extends PhysicalColorTokensConfig,
  T extends SemanticColorThemes = DefaultThemes,
  L extends string | number = DefaultLuminosities,
>({
  themes,
  semanticColors,
  namespace = '',
}: SemanticColorTokensConfig<P, T, L>): string => {
  return Object.entries(themes)
    .map(([themeId, predicate]) =>
      themeBlock(
        predicate,
        Object.entries(semanticColors)
          .map(
            ([tokenName, { [themeId]: tokenValue }]) =>
              `${
                predicate ? '    ' : '  '
              }--${namespace}${tokenName}: var(${tokenValue});`,
          )
          .join('\n'),
      ),
    )
    .join('\n\n');
};
