// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { Plugin } from 'vite';
import autoprefixer from 'autoprefixer';
import nesting from 'postcss-nesting';
import chTheme from '@ch-ui/theme';

const ext = /ch-t/;

export default function vitePluginTheme(options?: { root?: string }): Plugin {
  // TODO: render CSS custom property declarations from options…?
  //  …or, like tailwind, could this be made into a postcss plugin?
  return {
    name: 'vite-plugin-ch-ui-theme',
    config: async ({ root }, env) => {
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
