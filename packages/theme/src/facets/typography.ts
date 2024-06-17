// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  ExponentialPhysicalLayer,
  renderExponentialLayer,
} from '../physical-layer';
import { SemanticLayer } from '../types';
import { renderSemanticLayer } from '../semantic-layer';
import { facetSemanticValues } from '../util';

export type TypographicFacet<
  K extends string = string,
  S extends string = string,
> = {
  physical: ExponentialPhysicalLayer<S>;
  semantic?: SemanticLayer<K, S>;
};

export const renderTypographicFacet = ({
  physical,
  semantic,
}: TypographicFacet) => {
  const semanticValues = facetSemanticValues(semantic);
  return [
    renderExponentialLayer(physical, semanticValues),
    ...(semantic ? [renderSemanticLayer(semantic)] : []),
  ].join('\n\n');
};
