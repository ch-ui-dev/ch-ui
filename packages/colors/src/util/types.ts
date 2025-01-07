// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

export type AlphaLuminosity = number | string;

export type Vec3 = [number, number, number];

export type BezierCurve = {
  points: [Vec3, Vec3, Vec3];
  cacheArcLengths?: number[];
};

/**
 * Gamuts expressly supported by the versions of colorjs.io used by this
 * package. Copied from the `SpaceAccessors` class in colorjs.io which is not
 * exported on its own.
 */
export type Gamut =
  | 'a98rgb'
  | 'a98rgb_linear'
  | 'acescc'
  | 'acescg'
  | 'cam16_jmh'
  | 'hct'
  | 'hpluv'
  | 'hsl'
  | 'hsluv'
  | 'hsv'
  | 'hwb'
  | 'ictcp'
  | 'jzazbz'
  | 'jzczhz'
  | 'lab'
  | 'lab_d65'
  | 'lch'
  | 'lchuv'
  | 'luv'
  | 'oklab'
  | 'oklch'
  | 'p3'
  | 'p3_linear'
  | 'prophoto'
  | 'prophoto_linear'
  | 'rec2020'
  | 'rec2020_linear'
  | 'rec2100hlg'
  | 'rec2100pq'
  | 'srgb'
  | 'srgb_linear'
  | 'xyz'
  | 'xyz_abs_d65'
  | 'xyz_d50'
  | 'xyz_d65';

export interface Arc {
  curves: BezierCurve[];
  cacheLengths?: number[];
}

export interface HelicalArc extends Arc {
  torsion?: number;
  torsionT0?: number;
}

export type HelicalArcConfig = {
  keyPoint: Vec3;
  lowerCp: number;
  upperCp: number;
  torsion: number;
};
