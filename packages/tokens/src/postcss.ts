// Required notice: Copyright (c) 2025, Will Shown <ch-ui@willshown.com>

import { AtRule, parse, PluginCreator } from 'postcss';
import { renderTokenSet, TokenSet } from './token-set';

export type PluginOptions = {
  config: (params: AtRule['params']) => Promise<TokenSet> | TokenSet;
};

const creator: PluginCreator<PluginOptions> = (opts?: PluginOptions) => {
  return {
    postcssPlugin: '@ch-ui/tokens',
    AtRule: {
      async tokens(rule) {
        const config = (await opts?.config(rule.params)) ?? {};
        rule.replaceWith(
          parse(renderTokenSet(config), {
            from: rule.source?.input.file ?? 'unknown',
          }),
        );
      },
    },
  };
};

creator.postcss = true;

export default creator;
