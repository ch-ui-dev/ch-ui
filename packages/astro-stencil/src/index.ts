// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { AstroIntegration } from 'astro';

const chDeps = [
  '@ch-ui/elements/ch-icon',
  '@ch-ui/elements/ch-button',
  '@ch-ui/elements/ch-link',
];

export const elementsAstro = (): AstroIntegration => {
  return {
    name: 'ch-ui-elements-ssr',
    hooks: {
      'astro:config:setup': ({ addRenderer, updateConfig }) => {
        addRenderer({
          name: 'custom-elements-ssr',
          serverEntrypoint: '@ch-ui/astro-stencil/server.js',
        });
        updateConfig({
          vite: {
            optimizeDeps: {
              include: ['@ch-ui/elements/hydrate', ...chDeps],
              exclude: ['@ch-ui/astro-stencil/server.js'],
            },
            ssr: {
              optimizeDeps: {
                include: chDeps,
              },
            },
          },
        });
      },
    },
  };
};
