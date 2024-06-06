// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { getPointsOnCurvePath } from './geometry';
import { CurvedHelixPath, OutputGamut, Palette, Vec3 } from './types';
import Color from 'colorjs';

// This file contains functions that combine geometry and color math to create
// and work with palette curves.

/**
 * When distributing output shades along the curve, for each shade’s lightness a
 * logarithmically distributed value is averaged with a linearly distributed
 * value to this degree between zero and one, zero meaning use the logarithmic
 * value, one meaning use the linear value.
 */

function getLinearSpace(min: number, max: number, n: number) {
  const result = [];
  const delta = (max - min) / n;
  for (let i = 0; i < n; i++) {
    result[i] = min + delta * i;
  }
  return result;
}

function paletteShadesFromCurvePoints(
  curvePoints: Vec3[],
  nShades: number,
  range = [0, 1],
  _gamut: OutputGamut = 'srgb',
): Vec3[] {
  if (curvePoints.length <= 2) {
    return [];
  }

  const paletteShades = [];

  const linearLightness = getLinearSpace(range[0], range[1], nShades);

  let c = 0;

  for (let i = 0; i < nShades; i++) {
    const l = Math.min(range[1], Math.max(range[0], linearLightness[i]));

    while (l > curvePoints[c + 1][0]) {
      c++;
    }

    const [l1, a1, b1] = curvePoints[c];
    const [l2, a2, b2] = curvePoints[c + 1];

    const u = (l - l1) / (l2 - l1);

    paletteShades[i] = [
      l1 + (l2 - l1) * u,
      a1 + (a2 - a1) * u,
      b1 + (b2 - b1) * u,
    ] as Vec3;
  }

  // does this need to be snapped into the gamut?
  return paletteShades;
}

export function paletteShadesFromCurve(
  curve: CurvedHelixPath,
  nShades = 16,
  range = [0, 1],
  gamut: OutputGamut = 'srgb',
  curveDepth = 24,
): Vec3[] {
  return paletteShadesFromCurvePoints(
    getPointsOnCurvePath(
      curve,
      Math.ceil((curveDepth * (1 + Math.abs(curve.torsion || 1))) / 2),
    ).map((curvePoint: Vec3) =>
      getPointOnHelix(curvePoint, curve.torsion, curve.torsionT0),
    ),
    nShades,
    range,
    gamut,
  );
}

export function shadeToValue(Lab: Vec3, gamut: OutputGamut): string {
  return new Color('oklab', Lab).to(gamut).toString({ inGamut: true });
}

function paletteShadesToValues(
  paletteShades: Vec3[],
  gamut: OutputGamut,
): string[] {
  return paletteShades.map((shade) => shadeToValue(shade, gamut));
}

function getPointOnHelix(
  pointOnCurve: Vec3,
  torsion = 0,
  torsionT0 = 50,
): Vec3 {
  const t = pointOnCurve[0];
  const [l, c, h] = new Color('oklab', pointOnCurve).to('oklch').oklch;
  const hueOffset = torsion * (t - torsionT0);
  return Array.from(
    new Color('oklch', [l, c, h + hueOffset]).to('oklab').oklab,
  ) as Vec3;
}

export function curvePathFromPalette({
  keyColor: keyColorCoords,
  darkCp,
  lightCp,
  hueTorsion,
}: Palette): CurvedHelixPath {
  const blackPosition = [0, 0, 0];
  const whitePosition = [1, 0, 0];
  const keyColor = new Color('lch', keyColorCoords);
  const [l, a, b] = keyColor.to('oklab').oklab;

  const keyColorPosition = [l, a, b];
  const darkControlPosition = [l * (1 - darkCp), a, b];
  const lightControlPosition = [l + (1 - l) * lightCp, a, b];

  return {
    curves: [
      { points: [blackPosition, darkControlPosition, keyColorPosition] },
      { points: [keyColorPosition, lightControlPosition, whitePosition] },
    ],
    torsion: hueTorsion,
    torsionT0: l,
  } as CurvedHelixPath;
}

export function cssGradientFromCurve(
  curve: CurvedHelixPath,
  nShades = 16,
  range = [0, 1],
  gamut: OutputGamut = 'srgb',
  curveDepth = 24,
) {
  const values = paletteShadesToValues(
    paletteShadesFromCurve(curve, nShades, range, gamut, curveDepth),
    gamut,
  );
  return `linear-gradient(to right, ${values.join(', ')})`;
}
