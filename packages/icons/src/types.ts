// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { Config } from 'svg-sprite';

export type BundleParams = {
  tokenPattern: string;
  assetPath: (...matches: string[]) => string;
  spritePath: string;
  contentPaths: string[];
  config?: Config;
};
