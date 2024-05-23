// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import './ch-button.css';

export default {
  // this creates a ‘Components’ folder and a ‘MyComponent’ subfolder
  title: 'Elements/ch-button',
};

const Template = (args) => `<ch-button>${args.children}</ch-button>`;

export const Example = Template.bind({});

Example.args = {
  children: `Confirm`,
};
