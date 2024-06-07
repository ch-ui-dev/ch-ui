// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { PluginCreator, parse, AtRule } from 'postcss';
import { ThemeConfig } from './theme';
import { renderColorTokens, renderTypographyTokens } from './configs';

export type PluginOptions = {
  config: (params: AtRule['params']) => Promise<ThemeConfig> | ThemeConfig;
};

const creator: PluginCreator<PluginOptions> = (opts?: PluginOptions) => {
  return {
    postcssPlugin: '@ch-ui/theme',
    AtRule: {
      async chui(rule) {
        const config = (await opts?.config(rule.params)) ?? {};
        rule.replaceWith(
          parse(
            `${config.colors ? renderColorTokens(config.colors) : ''}\n\n${
              config.typography ? renderTypographyTokens(config.typography) : ''
            }`,
          ),
        );
      },
    },
  };
};

creator.postcss = true;

export * from './configs';
export * from './types';
export * from './theme';

export default creator;
