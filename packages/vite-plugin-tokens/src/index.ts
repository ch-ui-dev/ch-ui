// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { Plugin } from 'vite';
import autoprefixer from 'autoprefixer';
import nesting from 'postcss-nesting';
import chTokens, { type PluginOptions } from '@ch-ui/tokens';

export {
  type TokenSet,
  type PluginOptions,
  defaultTokenSet,
} from '@ch-ui/tokens';

export default function vitePluginTokens(options?: PluginOptions): Plugin {
  // TODO: render CSS custom property declarations from options…?
  //  …or, like tailwind, could this be made into a postcss plugin?
  return {
    name: 'vite-plugin-ch-ui-tokens',
    config: async () => {
      return {
        css: {
          postcss: {
            plugins: [nesting, chTokens(options), autoprefixer],
          },
        },
      };
    },
  };
}
