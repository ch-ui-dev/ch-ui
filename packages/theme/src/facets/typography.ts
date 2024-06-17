// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { ExponentialPhysicalLayer } from '../physical-layer';
import { SemanticLayer } from '../types';

export type FontSizeFacet<
  K extends string = string,
  S extends string = string,
> = {
  physical: ExponentialPhysicalLayer<S>;
  semantic?: SemanticLayer<K, S>;
};

export type LineHeightFacet<
  K extends string = string,
  S extends string = string,
> = {
  physical: ExponentialPhysicalLayer<S>;
  semantic?: SemanticLayer<K, S>;
};
