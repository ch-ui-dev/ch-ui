// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>
import './ch-button-group.css';

export default {
  // this creates a ‘Components’ folder and a ‘MyComponent’ subfolder
  title: 'Elements/ch-button-group',
};

const Template = (args) =>
  `<ch-button-group aria-label='potatoes' class='squirrels'>${args.children}</ch-button-group>`;

export const Example = Template.bind({});

Example.args = {
  children: `<ch-button>Left</ch-button><ch-button>Right</ch-button>`,
};
