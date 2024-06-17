// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { SemanticLayer } from '../types';
import {
  ColorsPhysicalLayer,
  renderPhysicalColorLayer,
} from '../physical-layer';
import { renderSemanticLayer } from '../semantic-layer';
import { facetSemanticValues } from '../util';

export type ColorFacet = {
  physical: ColorsPhysicalLayer;
  semantic?: SemanticLayer;
};

export const renderColorFacet = ({ physical, semantic }: ColorFacet) => {
  const semanticValues = facetSemanticValues(semantic);
  return [
    renderPhysicalColorLayer(physical, semanticValues),
    ...(semantic ? [renderSemanticLayer(semantic)] : []),
  ].join('\n\n');
};
