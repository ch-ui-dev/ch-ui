// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { type Preview } from '@storybook/react';

import { defineCustomElements } from '@ch-ui/elements/loader';

/**
 * Load @ch-ui/elements.
 */
defineCustomElements();

/**
 * Configure Storybook rendering.
 * https://storybook.js.org/docs/configure#configure-story-rendering
 */
const preview: Preview = {
  // https://storybook.js.org/docs/writing-stories/parameters#global-parameters
  parameters: {
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    // Disables Chromatic's snapshotting on a global level.
    chromatic: {
      disableSnapshot: true,
    },
  },
};

export const parameters: Preview['parameters'] = preview.parameters;

export default preview;
