// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>
import {
  type HelicalArcConfig,
  type Gamut,
  type Vec3,
  helicalArcFromConfig,
  constellationFromHelicalArc,
  oklabVectorToValue,
} from '@ch-ui/colors';
import {
  Conditions,
  HelicalArcSeries,
  PhysicalLayer,
  PhysicalSeries,
} from '../types';
import { renderCondition } from '../util';
import { seriesValues } from '../util/seriesValues';

const dtor = Math.PI / 180;

const colorGamutBlock = (gamut: Gamut, block: string) => {
  if (gamut === 'srgb') {
    return renderCondition(block, 0, [':root']);
  } else {
    return renderCondition(block, 0, [
      `@media (color-gamut: ${gamut})`,
      ':root',
    ]);
  }
};

export type ColorsPhysicalLayer = PhysicalLayer<Gamut, HelicalArcSeries>;

export const renderPhysicalColorTokens = ({
  conditions,
  series,
  namespace = '',
}: ColorsPhysicalLayer): string => {
  return `${Object.entries(conditions)
    .map(([conditionId, statements]) =>
      renderCondition(
        Object.entries(series)
          .map(([seriesId, { [conditionId as Gamut]: helicalArcSeries }]) => {
            return getOklabVectorsFromLuminosities(
              seriesValues(helicalArcSeries!),
              constellationFromPalette(helicalArcSeries!),
            )
              .map((oklab) => {
                return `--${namespace}${seriesId}-${Math.floor(
                  oklab[0] * 1000,
                )}: ${oklabVectorToValue(oklab, conditionId as Gamut)};`;
              })
              .join('\n');
          })
          .join('\n\n'),
        0,
        statements,
      ),
    )
    .join('\n\n')}`;
};

export const getOklabVectorsFromLuminosities = (
  luminosities: number[],
  constellation: Vec3[],
): Vec3[] => {
  let c = 0;

  const result: Vec3[] = [];

  for (let i = 0; i < luminosities.length; i++) {
    const l = luminosities[i];

    while (constellation[c + 1] && l > constellation[c + 1][0]) {
      c++;
    }

    const [l1, a1, b1] = constellation[c];
    const [l2, a2, b2] = constellation[c + 1];

    const u = (l - l1) / (l2 - l1);

    result.push([
      l1 + (l2 - l1) * u,
      a1 + (a2 - a1) * u,
      b1 + (b2 - b1) * u,
    ] as Vec3);
  }

  return result;
};

export const constellationFromPalette = (
  helicalArcConfig: HelicalArcConfig,
  curveDepth: number = 32,
) =>
  constellationFromHelicalArc(
    helicalArcFromConfig(helicalArcConfig),
    curveDepth,
  );

type DefaultThemes = Conditions<'light' | 'dark'>;

export type SemanticColorTokensConfig<
  /**
   * The physical token config this will draw from
   */
  P extends ColorsPhysicalLayer,
  /**
   * The map of theme ids to their wrapping predicates
   */
  T extends Conditions = DefaultThemes,
  /**
   * Possible values of luminosities from the physical color tokens config.
   */
  L extends number = number,
> = {
  themes: T;
  semanticColors: Record<string, Record<keyof T, [keyof P['series'], L]>>;
  namespace?: string;
};

export const renderSemanticColorTokens = <
  P extends ColorsPhysicalLayer,
  T extends Conditions = DefaultThemes,
  L extends number = number,
>({
  themes,
  semanticColors,
  namespace = '',
}: SemanticColorTokensConfig<P, T, L>): string => {
  return Object.entries(themes)
    .map(([themeId, statements]) =>
      renderCondition(
        Object.entries(semanticColors)
          .map(
            ([
              tokenName,
              {
                [themeId]: [palette, luminosity],
              },
            ]) =>
              `--${namespace}${tokenName}: var(--${namespace}${String(
                palette,
              )}-${luminosity * 1000});`,
          )
          .join('\n'),
        0,
        statements,
      ),
    )
    .join('\n\n');
};

// --------------------------------------------------
// Combined colors
// --------------------------------------------------

export type ColorTokensConfig<
  P extends ColorsPhysicalLayer,
  T extends Conditions = DefaultThemes,
  L extends number = number,
> = P & SemanticColorTokensConfig<P, T, L>;

type SemanticLuminosities<Q extends keyof ColorsPhysicalLayer['series']> =
  Record<Q, Set<number>>;

export const renderColorTokens = <
  P extends ColorsPhysicalLayer,
  T extends Conditions = DefaultThemes,
  L extends number = number,
>({
  conditions,
  themes,
  series,
  semanticColors,
  namespace = '',
}: ColorTokensConfig<P, T, L>): string => {
  const semanticLuminosities = Object.values(semanticColors).reduce(
    (acc: SemanticLuminosities<keyof typeof series>, sememe) =>
      Object.values(sememe).reduce(
        (
          acc: SemanticLuminosities<keyof typeof series>,
          [paletteId, luminosity],
        ) => {
          acc[paletteId as keyof typeof series].add(luminosity);
          return acc;
        },
        acc,
      ),
    Object.keys(series).reduce(
      (acc: SemanticLuminosities<keyof typeof series>, paletteId) => {
        acc[paletteId] = new Set();
        return acc;
      },
      {},
    ),
  );

  return [
    renderPhysicalColorTokens({
      conditions,
      series: Object.entries(series).reduce(
        (acc: ColorsPhysicalLayer['series'], [seriesId, seriesConfig]) => {
          acc[seriesId] = Object.entries(seriesConfig).reduce(
            (
              acc: PhysicalSeries<Partial<Gamut>, HelicalArcSeries>,
              [condition, conditionalSeries],
            ) => {
              acc[condition as Gamut] = {
                ...acc[condition as Gamut],
                values: [
                  ...(conditionalSeries.values ? conditionalSeries.values : []),
                  ...Array.from(semanticLuminosities[seriesId]),
                ],
              } as HelicalArcSeries;
              return acc;
            },
            seriesConfig,
          );
          return acc;
        },
        {},
      ),
      namespace,
    }),
    renderSemanticColorTokens<P, T, L>({ themes, semanticColors, namespace }),
  ].join('\n\n');
};
