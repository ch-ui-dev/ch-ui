// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'ch-ui',
  globalStyle: './src/ch-default-root.css',
  outputTargets: [
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'bundle',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    {
      type: 'docs-json',
      file: 'dist/docs.json',
    },
  ],
  testing: {
    browserHeadless: 'new',
  },
};
