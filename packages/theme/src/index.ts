// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { PluginCreator, parse, AtRule } from 'postcss';
import { ThemeConfig } from './theme';
import { renderPhysicalColorLayer } from './physical-layer';
import { renderTypographyTokens } from './facets';

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
            `${
              config.colors ? renderPhysicalColorLayer(config.colors) : ''
            }\n\n${
              config.typography ? renderTypographyTokens(config.typography) : ''
            }`,
          ),
        );
      },
    },
  };
};

creator.postcss = true;

export * from './facets';
export * from './physical-layer';
export * from './semantic-layer';
export * from './types';
export * from './theme';

export default creator;
