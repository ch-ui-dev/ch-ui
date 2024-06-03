// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

// TODO(thure): why is IDEA finding the type but TSC is not?
// @ts-ignore
import { defineCustomElements } from '@ch-ui/elements/loader';
import { setMode, chConfigProvider } from '@ch-ui/elements';
import { Preview } from '@storybook/web-components';
import './preview.css';

/**
 * Load @ch-ui/elements.
 */
chConfigProvider.sprite = './assets/sprite.svg';
defineCustomElements();
setMode(() => 'default');

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
