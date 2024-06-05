// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  DefaultLuminosities,
  PhysicalColorTokensConfig,
} from './physicalColors';
import { renderBlock } from '../render';
import { ConfigThemes, Statements } from '../types';

/**
 * Mapping theme ids to the set of nested at-rules-or-selectors
 */

type DefaultThemes = Record<'light' | 'dark', Statements>;

export type SemanticColorTokensConfig<
  /**
   * The physical token config this will draw from
   */
  P extends PhysicalColorTokensConfig,
  /**
   * The map of theme ids to their wrapping predicates
   */
  T extends ConfigThemes = DefaultThemes,
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

export const renderSemanticColorTokens = <
  P extends PhysicalColorTokensConfig,
  T extends ConfigThemes = DefaultThemes,
  L extends string | number = DefaultLuminosities,
>({
  themes,
  semanticColors,
  namespace = '',
}: SemanticColorTokensConfig<P, T, L>): string => {
  return Object.entries(themes)
    .map(([themeId, statements]) =>
      renderBlock(
        Object.entries(semanticColors)
          .map(
            ([tokenName, { [themeId]: tokenValue }]) =>
              `--${namespace}${tokenName}: var(${tokenValue});`,
          )
          .join('\n'),
        0,
        statements,
      ),
    )
    .join('\n\n');
};
