// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { arcToConstellation } from './geometry';
import {
  HelicalArc,
  Gamut,
  HelicalArcConfig,
  Vec3,
  AlphaLuminosity,
} from './types';
import Color from 'colorjs';

export const getLinearSpace = (
  min: number,
  max: number,
  n: number,
): number[] => {
  const result = [];
  const delta = (max - min) / n;
  for (let i = 0; i < n; i++) {
    result[i] = min + delta * i;
  }
  return result;
};

const alphaPattern = /\//;

export const parseAlphaLuminosity = (
  alphaLuminosity: AlphaLuminosity,
): [number, number | undefined] => {
  if (typeof alphaLuminosity === 'number') {
    return [alphaLuminosity, undefined];
  } else {
    const [luminosity, alpha] = alphaLuminosity.split(alphaPattern);
    return [parseFloat(luminosity), parseFloat(alpha)];
  }
};

export const getOklabVectorsFromLuminosities = (
  luminosities: AlphaLuminosity[],
  constellation: Vec3[],
): Vec3[] => {
  let c = 0;

  const result: Vec3[] = [];

  for (let i = 0; i < luminosities.length; i++) {
    const [l] = parseAlphaLuminosity(luminosities[i]);

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

export function oklabVectorToValue(
  Lab: Vec3,
  gamut: Gamut,
  alpha?: number,
): string {
  return new Color('oklab', Lab, alpha).to(gamut).toString({ inGamut: true });
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
  const keyColor = new Color('oklch', keyPoint);
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
  return `linear-gradient(to right, ${constellationToValues(
    getOklabVectorsFromLuminosities(
      getLinearSpace(range[0], range[1], nShades),
      constellationFromHelicalArc(curve, curveDepth),
    ),
    gamut,
  ).join(', ')})`;
}
