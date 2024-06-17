// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  ExponentialSeries,
  LinearSeries,
  Conditions,
  Statements,
} from '../types';
import { renderCondition, resolveNaming, seriesValues } from '../util';
import { renderExponentialTokens } from '../physical-layer';

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

export type TypographyTokensConfig<T extends Conditions = DefaultThemes> = {
  themes: T;
  fonts: Record<string, Record<keyof T, FontConfig>>;
  namespace?: string;
};

export const renderTypographyTokens = <T extends Conditions = DefaultThemes>({
  themes,
  fonts,
  namespace = '',
}: TypographyTokensConfig<T>) => {
  return Object.entries(fonts)
    .map(([fontId, fontThemes]) => {
      return Object.entries(fontThemes)
        .map(([conditionId, fontConfig]) => {
          const statements = themes[conditionId];
          return renderCondition(
            Object.entries(fontConfig)
              .map(([attribute, series]) => {
                if (!series) {
                  return;
                } else {
                  switch (attribute) {
                    case 'fontFamily':
                      return `--${namespace}font-${fontId}: ${series};`;
                    case 'weights':
                      const weights = series as LinearSeries;
                      return Object.entries(weights.naming!)
                        .map(([name, value]) => {
                          return `--${namespace}${fontId}-weight-${name}: ${value};`;
                        })
                        .join('\n');
                    case 'sizes':
                      const sizes = series as ExponentialSeries;
                      const values = seriesValues(sizes);
                      const resolvedNaming = resolveNaming(sizes.naming);
                      return renderExponentialTokens({
                        seriesId: `${fontId}-size`,
                        series: sizes,
                        conditionId,
                        values,
                        resolvedNaming,
                        namespace,
                      }).join('\n');
                    case 'lineHeights':
                      const lineHeights = series as ExponentialSeries;
                      return Object.entries(lineHeights.naming!)
                        .map(([name, value]) => {
                          return `--${namespace}${fontId}-lineHeight-${name}: ${(
                            lineHeights.initial *
                            Math.pow(lineHeights.base, value)
                          ).toFixed(2)}${lineHeights.unit};`;
                        })
                        .join('\n');
                    case 'fontStyles':
                      const fontStyles = series as Record<string, string>;
                      return Object.entries(fontStyles)
                        .map(([name, value]) => {
                          return `--${namespace}${fontId}-style-${name}: ${value};`;
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
