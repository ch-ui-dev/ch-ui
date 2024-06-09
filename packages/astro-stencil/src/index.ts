// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { AstroIntegration } from 'astro';

export const elementsAstro = (): AstroIntegration => {
  return {
    name: 'ch-ui-elements-ssr',
    hooks: {
      'astro:config:setup': ({ addRenderer, updateConfig }) => {
        addRenderer({
          name: 'custom-elements-ssr',
          serverEntrypoint: '@ch-ui/astro-stencil/server.js',
        });
      },
    },
  };
};
