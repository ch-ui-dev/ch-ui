// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { Plugin } from 'vite';
import autoprefixer from 'autoprefixer';
import nesting from 'postcss-nesting';
import chTheme, { type PluginOptions } from '@ch-ui/tokens';

export {
  type ThemeConfig,
  type PluginOptions,
  defaultTheme,
} from '@ch-ui/tokens';

export default function vitePluginTheme(options?: PluginOptions): Plugin {
  // TODO: render CSS custom property declarations from options…?
  //  …or, like tailwind, could this be made into a postcss plugin?
  return {
    name: 'vite-plugin-ch-ui-theme',
    config: async () => {
      return {
        css: {
          postcss: {
            plugins: [nesting, chTheme(options), autoprefixer],
          },
        },
      };
    },
  };
}
