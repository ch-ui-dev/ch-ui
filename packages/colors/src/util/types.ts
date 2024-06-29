// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import SpaceAccessors from 'colorjs/types/src/space-coord-accessors';

export type Vec3 = [number, number, number];

export type BezierCurve = {
  points: [Vec3, Vec3, Vec3];
  cacheArcLengths?: number[];
};

export type Gamut = keyof SpaceAccessors;

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
