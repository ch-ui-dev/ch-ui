// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { PluginCreator, parse } from 'postcss';
import { resolve } from 'node:path';
export * from './physicalColors';
export * from './semanticColors';
import { ThemeConfig } from './theme';
import { renderPhysicalColorTokens } from './physicalColors';
import { renderSemanticColorTokens } from './semanticColors';

type PluginOptions = {
  root?: string;
};

const creator: PluginCreator<PluginOptions> = (opts?: PluginOptions) => {
  return {
    postcssPlugin: '@ch-ui/theme',
    AtRule: {
      async chui(rule) {
        console.log('[Encountered @chui]', rule.params);
        const configModule = await import(
          resolve(...(opts?.root ? [opts.root, rule.params] : [rule.params]))
        );
        const config: ThemeConfig = configModule.default.default;
        console.log('[theme plugin config]', config);
        rule.replaceWith(
          parse(
            `${
              config.physicalColors
                ? renderPhysicalColorTokens(config.physicalColors)
                : ''
            }\n\n${
              config.semanticColors
                ? renderSemanticColorTokens(config.semanticColors)
                : ''
            }`,
          ),
        );
      },
    },
  };
};

creator.postcss = true;

export default creator;
