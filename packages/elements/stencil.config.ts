// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { Config } from '@stencil/core';
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

export const config: Config = {
  namespace: 'ch-ui',
  globalStyle: './src/ch-default-root.css',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: 'loader',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    {
      type: 'docs-json',
      file: 'dist/docs.json',
    },
    {
      type: 'docs-custom',
      generator: async function (docs, config) {
        const astroDocs = resolve(
          __dirname,
          '../../utils/app-astro/src/pages/elements',
        );
        try {
          mkdir(astroDocs);
        } finally {
          await docs.components.forEach(async (component) => {
            const page = `---
layout: ../../layouts/DocsLayout.astro
title: "${component.tag}"
---

# \`&lt;${component.tag}&rt;\`

${component.docs.replace('\n', ' ')}
`;
            await writeFile(resolve(astroDocs, `${component.tag}.md`), page);
          });
        }
      },
    },
  ],
  testing: {
    browserHeadless: 'new',
  },
};
