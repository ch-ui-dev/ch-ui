// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  ExponentialSeries,
  LinearSeries,
  ConfigThemes,
  Statements,
} from '../types';
import { renderBlock } from '../render';

export type FontConfig = {
  /**
   * The `font-family` value to use.
   */
  fontFamily: string;
  /**
   * The series of weights to make available.
   */
  weights?: LinearSeries;
  /**
   * The series of sizes to make available.
   */
  sizes?: ExponentialSeries;
  /**
   * The series of weights to make available.
   */
  lineHeights?: ExponentialSeries;
  /**
   * The series of weights to make available, as a map of { name -> value }
   */
  fontStyles?: Record<string, string>;
};

type DefaultThemes = Record<'root', Statements>;

export type TypographyTokensConfig<T extends ConfigThemes = DefaultThemes> = {
  themes: T;
  fonts: Record<string, Record<keyof T, FontConfig>>;
  namespace?: string;
};

export const renderTypographyTokens = <T extends ConfigThemes = DefaultThemes>({
  themes,
  fonts,
}: TypographyTokensConfig<T>) => {
  return Object.entries(fonts)
    .map(([fontId, fontThemes]) => {
      return Object.entries(fontThemes)
        .map(([themeId, fontConfig]) => {
          const statements = themes[themeId];
          return renderBlock(
            Object.entries(fontConfig)
              .map(([attribute, values]) => {
                if (!values) {
                  return;
                } else {
                  switch (attribute) {
                    case 'fontFamily':
                      return `--font-${fontId}: ${values};`;
                    case 'weights':
                      const weights = values as LinearSeries;
                      return Object.entries(weights.keys)
                        .map(([name, value]) => {
                          return `--${fontId}-weight-${name}: ${value};`;
                        })
                        .join('\n');
                    case 'sizes':
                      const sizes = values as ExponentialSeries;
                      return Object.entries(sizes.keys)
                        .map(([name, value]) => {
                          return `--${fontId}-size-${name}: ${(
                            sizes.initial * Math.pow(sizes.base, value)
                          ).toFixed(2)}${sizes.unit};`;
                        })
                        .join('\n');
                    case 'lineHeights':
                      const lineHeights = values as ExponentialSeries;
                      return Object.entries(lineHeights.keys)
                        .map(([name, value]) => {
                          return `--${fontId}-lineHeight-${name}: ${(
                            lineHeights.initial *
                            Math.pow(lineHeights.base, value)
                          ).toFixed(2)}${lineHeights.unit};`;
                        })
                        .join('\n');
                    case 'fontStyles':
                      const fontStyles = values as Record<string, string>;
                      return Object.entries(fontStyles)
                        .map(([name, value]) => {
                          return `--${fontId}-style-${name}: ${value};`;
                        })
                        .join('\n');
                  }
                }
              })
              .join('\n\n'),
            0,
            statements,
          );
        })
        .join('\n\n');
    })
    .join('\n\n');
};
