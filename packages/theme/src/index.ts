// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { PluginCreator, parse, AtRule } from 'postcss';
import { ThemeConfig } from './theme';
import { renderColorFacet, renderTypographicFacet } from './facets';

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
            [
              ...(config.colors ? [renderColorFacet(config.colors)] : []),
              ...(config.fontSizes
                ? [renderTypographicFacet(config.fontSizes)]
                : []),
              ...(config.lineHeights
                ? [renderTypographicFacet(config.lineHeights)]
                : []),
            ].join('\n\n'),
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
