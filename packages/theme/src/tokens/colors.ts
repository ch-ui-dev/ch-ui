// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

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
  Lab_to_P3_value,
  Lab_to_sRGB_value,
  Lab_to_rec2020_value,
} from '@ch-ui/colors';

const defaultLuminosities: number[] = [...Array(19)].map((_, i) => 50 + i * 50);

type PaletteConfig = Palette &
  Partial<{
    /**
     * Values between 0 and 1000.
     */
    luminosities: number[];
  }>;

type ColorTokensConfig = {
  /**
   * ‘reflective’ numbering is negatively related with luminosity,
   * whereas ‘emissive’ numbering is positively related.
   */
  shadeNumbering?: 'reflective' | 'emissive';
  /**
   * Palette curves (using LCH key colors), keyed by their id
   */
  palettes: { [paletteId: string]: PaletteConfig };
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
      return `@media (color-gamut: rec2020) { ${block} }`;
    case 'P3':
      return `@media (color-gamut: p3) { ${block} }`;
    case 'sRGB':
    default:
      return block;
  }
};

const lerp = (luminosity: number, landmarks: Vec3[]): Vec3 => {
  if (luminosity > 999) {
    return [100, 0, 0];
  } else if (luminosity < 1) {
    return [0, 0, 0];
  } else if (luminosity % 50 === 0) {
    return landmarks[luminosity / 50];
  } else {
    const k2 = (luminosity % 50) / 50;
    const k1 = 1 - k2;
    const [l1, a1, b1] = landmarks[Math.floor(luminosity / 50)];
    const [l2, a2, b2] = landmarks[Math.ceil(luminosity / 50)];
    return [l1 * k1 + l2 * k2, a1 * k1 + a2 * k2, b1 * k1 + b2 * k2];
  }
};

const shadeNumber = (
  shadeNumbering: ColorTokensConfig['shadeNumbering'],
  luminosity: number,
) => {
  return shadeNumbering === 'emissive' ? luminosity : 1000 - luminosity;
};

const colorValue = (gamut: OutputGamut, lab: Vec3) => {
  switch (gamut) {
    case 'rec2020':
      return Lab_to_rec2020_value(lab);
    case 'P3':
      return Lab_to_P3_value(lab);
    case 'sRGB':
    default:
      return Lab_to_sRGB_value(lab);
  }
};

const landmarksFromPalette = (gamut: OutputGamut, palette: Palette) =>
  paletteShadesFromCurve(
    curvePathFromPalette(palette),
    21,
    [0, 100 * (22 / 21)],
    gamut,
    1,
    24,
  );

export const renderPhysicalColorTokens = ({
  shadeNumbering = 'reflective',
  palettes,
  gamuts = [],
  namespace = '',
}: ColorTokensConfig): string => {
  const outputGamuts = ['sRGB' as const, ...gamuts];
  return `${outputGamuts
    .map((gamut) =>
      colorGamutBlock(
        gamut,
        Object.entries(palettes)
          .map(
            ([
              paletteId,
              { luminosities = defaultLuminosities, ...palette },
            ]) => {
              const landmarks = landmarksFromPalette(gamut, palette);
              return luminosities
                .map((luminosity) => {
                  const lab = lerp(luminosity, landmarks);
                  return `${
                    gamut === 'sRGB' ? '' : '  '
                  }--${namespace}${paletteId}-${shadeNumber(
                    shadeNumbering,
                    luminosity,
                  )}: ${colorValue(gamut, lab)};`;
                })
                .join('\n');
            },
          )
          .join('\n\n'),
      ),
    )
    .join('\n\n')}`;
};
