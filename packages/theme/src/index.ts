// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { PluginCreator, parse, AtRule } from 'postcss';
import { ThemeConfig, renderTheme } from './theme';

export type PluginOptions = {
  config: (params: AtRule['params']) => Promise<ThemeConfig> | ThemeConfig;
};

const creator: PluginCreator<PluginOptions> = (opts?: PluginOptions) => {
  return {
    postcssPlugin: '@ch-ui/theme',
    AtRule: {
      async chui(rule) {
        const config = (await opts?.config(rule.params)) ?? {};
        rule.replaceWith(parse(renderTheme(config)));
      },
    },
  };
};

creator.postcss = true;

export * from './facet';
export * from './physical-layer';
export * from './semantic-layer';
export * from './types';
export * from './theme';

export default creator;
