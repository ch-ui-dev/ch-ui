// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { PluginCreator, parse, AtRule } from 'postcss';
import { TokenSet, renderTokenSet } from './token-set';

export type PluginOptions = {
  config: (params: AtRule['params']) => Promise<TokenSet> | TokenSet;
};

const creator: PluginCreator<PluginOptions> = (opts?: PluginOptions) => {
  return {
    postcssPlugin: '@ch-ui/tokens',
    AtRule: {
      async chui(rule) {
        const config = (await opts?.config(rule.params)) ?? {};
        rule.replaceWith(parse(renderTokenSet(config)));
      },
    },
  };
};

creator.postcss = true;

export * from './facet';
export * from './physical-layer';
export * from './semantic-layer';
export * from './types';
export * from './token-set';

export default creator;
