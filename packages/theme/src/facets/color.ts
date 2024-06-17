// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { SemanticLayer, SemanticValues } from '../types';
import {
  ColorsPhysicalLayer,
  renderPhysicalColorLayer,
} from '../physical-layer';
import { renderSemanticLayer } from '../semantic-layer';

export type ColorFacet = {
  physical: ColorsPhysicalLayer;
  semantic: SemanticLayer;
};

export const renderColorFacet = ({ physical, semantic }: ColorFacet) => {
  const semanticValues = Object.values(semantic.sememes).reduce(
    (acc: SemanticValues, sememe) => {
      Object.values(sememe).forEach(([seriesId, value]) => {
        if (!acc[seriesId]) {
          acc[seriesId] = new Set<number>();
        }
        acc[seriesId].add(value);
      });
      return acc;
    },
    {},
  );
  return [
    renderPhysicalColorLayer(physical, semanticValues),
    renderSemanticLayer(semantic),
  ].join('\n\n');
};
