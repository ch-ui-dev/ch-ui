// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

// TODO(thure): This is a workaround for Astro build needing SSR components to
//  have an associated import. Ideally this should be unnecessary.

const ChIcon = (props) => <ch-icon {...props} />;
ChIcon.is = 'ch-icon';

const ChButton = (props) => <ch-icon {...props} />;
ChButton.is = 'ch-button';

const ChLink = (props) => <ch-icon {...props} />;
ChLink.is = 'ch-link';

const ChOklchPicker = (props) => <ch-oklch-picker {...props} />;
ChOklchPicker.is = 'ch-oklch-picker';

export { ChIcon, ChButton, ChLink, ChOklchPicker };
