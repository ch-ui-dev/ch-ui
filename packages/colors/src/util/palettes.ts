// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { arcToConstellation } from './geometry';
import { HelicalArc, Gamut, HelicalArcConfig, Vec3 } from './types';
import Color from 'colorjs';

// This file contains functions that combine geometry and color math to create
// and work with palette curves.

function getLinearSpace(min: number, max: number, n: number) {
  const result = [];
  const delta = (max - min) / n;
  for (let i = 0; i < n; i++) {
    result[i] = min + delta * i;
  }
  return result;
}

// TODO(thure): Is this necessary given all the other lerping logic in @ch-ui/theme?
export function interpolateLuminosityAlignedConstellation(
  constellation: Vec3[],
  nShades: number,
  range = [0, 1],
): Vec3[] {
  if (constellation.length <= 2) {
    return [];
  }

  const paletteShades = [];

  const luminosities = getLinearSpace(range[0], range[1], nShades);

  let c = 0;

  for (let i = 0; i < nShades; i++) {
    const l = Math.min(range[1], Math.max(range[0], luminosities[i]));

    while (l > constellation[c + 1][0]) {
      c++;
    }

    const [l1, a1, b1] = constellation[c];
    const [l2, a2, b2] = constellation[c + 1];

    const u = (l - l1) / (l2 - l1);

    paletteShades[i] = [
      l1 + (l2 - l1) * u,
      a1 + (a2 - a1) * u,
      b1 + (b2 - b1) * u,
    ] as Vec3;
  }

  return paletteShades;
}

export function constellationFromHelicalArc(
  curve: HelicalArc,
  curveDepth = 32,
): Vec3[] {
  return arcToConstellation(
    curve,
    Math.ceil((curveDepth * (1 + Math.abs(curve.torsion || 1))) / 2),
  ).map((curvePoint: Vec3) =>
    applyTorsion(curvePoint, curve.torsion, curve.torsionT0),
  );
}

export function oklabVectorToValue(Lab: Vec3, gamut: Gamut): string {
  return new Color('oklab', Lab).to(gamut).toString({ inGamut: true });
}

function constellationToValues(constellation: Vec3[], gamut: Gamut): string[] {
  return constellation.map((shade) => oklabVectorToValue(shade, gamut));
}

function applyTorsion(pointOnCurve: Vec3, torsion = 0, torsionT0 = 0.5): Vec3 {
  const t = pointOnCurve[0];
  const [l, c, h] = new Color('oklab', pointOnCurve).to('oklch').oklch;
  const hueOffset = torsion * (t - torsionT0);
  return Array.from(
    new Color('oklch', [l, c, h + hueOffset]).to('oklab').oklab,
  ) as Vec3;
}

export function helicalArcFromConfig({
  keyPoint,
  lowerCp,
  upperCp,
  torsion,
}: HelicalArcConfig): HelicalArc {
  const blackPosition = [0, 0, 0];
  const whitePosition = [1, 0, 0];
  const keyColor = new Color('lch', keyPoint);
  const [l, a, b] = keyColor.to('oklab').oklab;

  const keyColorPosition = [l, a, b];
  const darkControlPosition = [l * (1 - lowerCp), a, b];
  const lightControlPosition = [l + (1 - l) * upperCp, a, b];

  return {
    curves: [
      { points: [blackPosition, darkControlPosition, keyColorPosition] },
      { points: [keyColorPosition, lightControlPosition, whitePosition] },
    ],
    torsion: torsion,
    torsionT0: l,
  } as HelicalArc;
}

export function cssGradientFromCurve(
  curve: HelicalArc,
  nShades = 21,
  range = [0, 1],
  gamut: Gamut = 'srgb',
  curveDepth = 32,
) {
  const values = constellationToValues(
    interpolateLuminosityAlignedConstellation(
      constellationFromHelicalArc(curve, curveDepth),
      nShades,
      range,
    ),
    gamut,
  );
  return `linear-gradient(to right, ${values.join(', ')})`;
}
