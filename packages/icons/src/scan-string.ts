// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { BundleParams } from './types';

export const scanString = ({
  tokenPattern,
  contentString,
}: Pick<BundleParams, 'tokenPattern'> & {
  contentString: string;
  extension?: string;
}): Set<string> => {
  const tokenExp = new RegExp(tokenPattern, 'gm');

  const matchResult = contentString.match(tokenExp);

  if (matchResult) {
    const [_, ...matches] = matchResult;
    return new Set<string>(matches);
  } else {
    return new Set<string>();
  }
};
