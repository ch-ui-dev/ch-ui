// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'ch-ui',
  globalStyle: './src/ch-default-root.css',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  testing: {
    browserHeadless: 'new',
  },
};
