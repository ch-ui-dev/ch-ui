// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import React from 'react';

import {
  curvePathFromPalette,
  paletteShadesFromCurve,
  Lab_to_P3_value as LabToP3, Vec3
} from '../util';

type PaletteConfig = {
  keyColor: Vec3;
  darkCp: number;
  lightCp: number;
  hueTorsion: number;
};

const shadeNumbers: number[] = /* [...Array(19)].map((_, i) => 50 + i * 50); */ [
  50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950,
];

const broadShadeNumbers: number[] = [
  12, 25, 37, 50, 75, 100, 125, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 825, 850, 875,
  900, 925, 950, 975,
];

const dtor = Math.PI / 180;

type ConfigPalette = 'primary';

const paletteConfigs: Record<ConfigPalette, PaletteConfig> = {
  primary: {
    keyColor: [43, 81, 282],
    darkCp: 0.86,
    lightCp: 1,
    hueTorsion: -30 * dtor,
  },
};

const physicalColors = Object.keys(paletteConfigs).reduce(
  (acc: Record<string, Record<string, string>>, palette) => {
    const isBroad = palette === 'neutral' || palette === 'primary';
    const paletteConfig = paletteConfigs[palette as ConfigPalette];
    const curve = curvePathFromPalette(paletteConfig);
    const defaultShades = paletteShadesFromCurve(curve, 21, [0, 100 * (22 / 21)], 'P3', 1, 24).reverse();
    const renderCssValue = (shadeNumber: number) => {
      if (shadeNumber > 999) {
        return 'black';
      } else if (shadeNumber < 1) {
        return 'white';
      } else if (shadeNumber % 50 === 0) {
        return LabToP3(defaultShades[shadeNumber / 50]);
      } else {
        const k2 = (shadeNumber % 50) / 50;
        const k1 = 1 - k2;
        const [l1, a1, b1] = defaultShades[Math.floor(shadeNumber / 50)];
        const [l2, a2, b2] = defaultShades[Math.ceil(shadeNumber / 50)];
        return LabToP3([l1 * k1 + l2 * k2, a1 * k1 + a2 * k2, b1 * k1 + b2 * k2]);
      }
    };
    acc[palette] = (isBroad ? broadShadeNumbers : shadeNumbers).reduce((acc: Record<string, string>, shadeNumber) => {
      acc[shadeNumber] = renderCssValue(shadeNumber);
      return acc;
    }, {});

    return acc;
  },
  {},
);

export default {
  title: 'colors'
};

export const Colors = () => {
  return Object.entries(physicalColors).map(([paletteName, palette])=>{
    return <>
      <h1>{paletteName}</h1>
      <ul>
        {Object.entries(palette).map(([shadeNumber, value])=> {
          return <li style={{ inlineSize: '4rem', blockSize: '4rem', backgroundColor: value }}>{shadeNumber}</li>
        })}
      </ul>
    </>
  })
}
