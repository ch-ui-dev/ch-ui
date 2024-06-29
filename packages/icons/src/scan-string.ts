// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { BundleParams } from './types';

export const scanString = ({
  symbolPattern,
  contentString,
}: Pick<BundleParams, 'symbolPattern'> & {
  contentString: string;
}): Set<string> => {
  const symbolExp = new RegExp(symbolPattern, 'gm');

  const matchResult = contentString.match(symbolExp);

  if (matchResult) {
    return new Set<string>(matchResult);
  } else {
    return new Set<string>();
  }
};
