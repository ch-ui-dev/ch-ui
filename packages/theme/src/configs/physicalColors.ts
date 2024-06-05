// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

// TODO: define how color tokens get specified

// Physical tokens
// input: gamuts, palette curve specs
// output: @supports <gamut> { --<palette>-<shade>: value } etc

// Semantic tokens
// input: modes (light, dark, forced-color), names, physical values
// output: --<name>: value

// TODO: ideally this is all something that can run in a worker, maybe?

import {
  type Palette,
  type OutputGamut,
  type Vec3,
  curvePathFromPalette,
  paletteShadesFromCurve,
  shadeToValue,
} from '@ch-ui/colors';
import { renderBlock } from '../render';

const dtor = Math.PI / 180;

const defaultLuminosities = /*[...Array(19)].map((_, i) => 50 + i * 50)*/ [
  50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800,
  850, 900, 950,
] as const;

export type DefaultLuminosities = (typeof defaultLuminosities)[number];

export type PaletteConfig = Palette &
  Partial<{
    /**
     * Values between 0 and 1000.
     */
    luminosities: number[];
  }>;

export type PhysicalColorTokensConfig = {
  /**
   * ‘reflective’ numbering is negatively related with luminosity,
   * whereas ‘emissive’ numbering is positively related.
   */
  shadeNumbering?: 'reflective' | 'emissive';
  /**
   * Palette curves (using LCH key colors and degree(º) hue torsion), keyed by their id
   */
  palettes: Record<string, PaletteConfig>;
  /**
   * Gamuts other than sRGB in which to output colors. sRGB will always be included as a fallback.
   */
  gamuts?: Exclude<OutputGamut, 'sRGB'>[];
  /**
   * The prefix for the tokens.
   */
  namespace?: string;
};

const colorGamutBlock = (gamut: OutputGamut, block: string) => {
  switch (gamut) {
    case 'rec2020':
      return renderBlock(block, 0, ['@media (color-gamut: rec2020)', ':root']);
    case 'p3':
      return renderBlock(block, 0, ['@media (color-gamut: p3)', ':root']);
    case 'srgb':
    default:
      return renderBlock(block, 0, [':root']);
  }
};

const lerp = (luminosity: number, constellation: Vec3[]): Vec3 => {
  if (luminosity > 999) {
    return [100, 0, 0];
  } else if (luminosity < 1) {
    return [0, 0, 0];
  } else if (luminosity % 50 === 0) {
    return constellation[luminosity / 50];
  } else {
    const k2 = (luminosity % 50) / 50;
    const k1 = 1 - k2;
    const [l1, a1, b1] = constellation[Math.floor(luminosity / 50)];
    const [l2, a2, b2] = constellation[Math.ceil(luminosity / 50)];
    return [l1 * k1 + l2 * k2, a1 * k1 + a2 * k2, b1 * k1 + b2 * k2];
  }
};

const shadeNumber = (
  shadeNumbering: PhysicalColorTokensConfig['shadeNumbering'],
  luminosity: number,
) => {
  return shadeNumbering === 'emissive' ? luminosity : 1000 - luminosity;
};

const constellationFromPalette = (gamut: OutputGamut, palette: Palette) =>
  paletteShadesFromCurve(
    curvePathFromPalette(palette),
    21,
    [0, 22 / 21],
    gamut,
    24,
  );

export const renderPhysicalColorTokens = ({
  shadeNumbering = 'reflective',
  palettes,
  gamuts = [],
  namespace = '',
}: PhysicalColorTokensConfig): string => {
  const outputGamuts = ['srgb' as const, ...gamuts];
  return `${outputGamuts
    .map((gamut) =>
      colorGamutBlock(
        gamut,
        Object.entries(palettes)
          .map(
            ([
              paletteId,
              {
                luminosities = defaultLuminosities,
                hueTorsion: hueTorsionDeg,
                ...palette
              },
            ]) => {
              const constellation = constellationFromPalette(gamut, {
                hueTorsion: dtor & hueTorsionDeg,
                ...palette,
              });
              return luminosities
                .map((luminosity) => {
                  const lab = lerp(luminosity, constellation);
                  return `--${namespace}${paletteId}-${shadeNumber(
                    shadeNumbering,
                    luminosity,
                  )}: ${shadeToValue(lab, gamut)};`;
                })
                .join('\n');
            },
          )
          .join('\n\n'),
      ),
    )
    .join('\n\n')}`;
};
