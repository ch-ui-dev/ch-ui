// Required notice: Copyright (c) 2025, Will Shown <ch-ui@willshown.com>

// Much of this file, especially `getLc`, is based upon colorjs.io, fetched 10 July 2025 from https://github.com/color-js/color.js/blob/main/src/contrast/APCA.js at revision 09fe3f3

import Color from 'colorjs';

// exponents
const normBg = 0.56;
const normTxt = 0.57;
const revTxt = 0.62;
const revBg = 0.65;

// clamps
const blkThrs = 0.022;
const blkClmp = 1.414;
const loClip = 0.1;
const deltaYMin = 0.0005;

// scalers
// see https://github.com/w3c/silver/issues/645
const WScale = 1.14;
const WOffset = 0.027;

export const getLc = (Ytxt: number, Ybg: number) => {
  let S;
  let C;
  let SApc;

  // are we "Black on White" (dark on light), or light on dark?
  let isDarkOnLight = Ybg > Ytxt;

  // why is this a delta, when Y is not perceptually uniform?
  // Answer: it is a noise gate, see
  // https://github.com/LeaVerou/color.js/issues/208
  if (Math.abs(Ybg - Ytxt) < deltaYMin) {
    C = 0;
  } else {
    if (isDarkOnLight) {
      // dark text on light background
      S = Ybg ** normBg - Ytxt ** normTxt;
      C = S * WScale;
    } else {
      // light text on dark background
      S = Ybg ** revBg - Ytxt ** revTxt;
      C = S * WScale;
    }
  }
  if (Math.abs(C) < loClip) {
    SApc = 0;
  } else if (C > 0) {
    SApc = C - WOffset;
  } else {
    SApc = C + WOffset;
  }

  return SApc * 100;
};

const getSApc = (Lc100: number) => {
  const Lc1 = Lc100 / 100;
  if (Math.abs(Lc1) <= WOffset) {
    return 0;
  } else {
    return Lc1 + WOffset * (Lc1 < 0 ? -1 : 1);
  }
};

export const getL = (get: 'text' | 'background', L: number, Lc100: number) => {
  const SApc = getSApc(Lc100);
  if (SApc === 0) {
    return L;
  } else {
    const isRev = Lc100 > 0 ? get === 'background' : get === 'text';
    const expTxt = isRev ? revTxt : normTxt;
    const expBg = isRev ? revBg : normBg;
    const expL = get === 'background' ? expTxt : expBg;
    const expS = get === 'background' ? expBg : expTxt;
    const K = get === 'background' ? 1 : -1;
    return Math.pow(
      Math.pow(L, expL) + (K * SApc) / WScale,
      1 / expS,
      //
    );
  }
};
