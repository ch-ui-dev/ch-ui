// Required notice: Copyright (c) 2025, Will Shown <ch-ui@willshown.com>

// Much of this file, especially `getLc`, is based upon colorjs.io, fetched 10 July 2025 from https://github.com/color-js/color.js/blob/main/src/contrast/APCA.js at revision 09fe3f3

import Color from 'colorjs';

// exponents
const normBG = 0.56;
const normTXT = 0.57;
const revTXT = 0.62;
const revBG = 0.65;

// clamps
const blkThrs = 0.022;
const blkClmp = 1.414;
const loClip = 0.1;
const deltaYmin = 0.0005;

// scalers
// see https://github.com/w3c/silver/issues/645
const Wscale = 1.14;
const Woffset = 0.027;

export const getLc = (Ytxt: number, Ybg: number) => {
  let S;
  let C;
  let Sapc;

  // are we "Black on White" (dark on light), or light on dark?
  let BoW = Ybg > Ytxt;

  // why is this a delta, when Y is not perceptually uniform?
  // Answer: it is a noise gate, see
  // https://github.com/LeaVerou/color.js/issues/208
  if (Math.abs(Ybg - Ytxt) < deltaYmin) {
    C = 0;
  } else {
    if (BoW) {
      // dark text on light background
      S = Ybg ** normBG - Ytxt ** normTXT;
      C = S * Wscale;
    } else {
      // light text on dark background
      S = Ybg ** revBG - Ytxt ** revTXT;
      C = S * Wscale;
    }
  }
  if (Math.abs(C) < loClip) {
    Sapc = 0;
  } else if (C > 0) {
    Sapc = C - Woffset;
  } else {
    Sapc = C + Woffset;
  }

  return Sapc * 100;
};

const getSapc = (Lc100: number) => {
  const Lc1 = Lc100 / 100;
  if (Math.abs(Lc1) <= Woffset) {
    return 0;
  } else {
    return Lc1 + Woffset * (Lc1 < 0 ? -1 : 1);
  }
};

export const getL = (get: 'text' | 'background', L: number, Lc100: number) => {
  const Sapc = getSapc(Lc100);
  if (Sapc === 0) {
    return L;
  } else {
    const isRev = Lc100 > 0 ? get === 'background' : get === 'text';
    const expTxt = isRev ? revTXT : normTXT;
    const expBg = isRev ? revBG : normBG;
    const expL = get === 'background' ? expTxt : expBg;
    const expS = get === 'background' ? expBg : expTxt;
    const K = get === 'background' ? 1 : -1;
    return Math.pow(
      Math.pow(L, expL) + (K * Sapc) / Wscale,
      1 / expS,
      //
    );
  }
};
