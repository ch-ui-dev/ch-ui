// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { PhysicalColorTokensConfig } from './physicalColors';
import { SemanticColorTokensConfig } from './semanticColors';

export type ThemeConfig = {
  physicalColors?: PhysicalColorTokensConfig;
  semanticColors?: SemanticColorTokensConfig<any>;
};
