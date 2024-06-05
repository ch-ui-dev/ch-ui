// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  PhysicalColorTokensConfig,
  SemanticColorTokensConfig,
} from './configs';

export type ThemeConfig = {
  physicalColors?: PhysicalColorTokensConfig;
  semanticColors?: SemanticColorTokensConfig<any>;
};
