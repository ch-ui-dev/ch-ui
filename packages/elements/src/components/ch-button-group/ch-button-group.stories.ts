// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

export default {
  // this creates a ‘Components’ folder and a ‘MyComponent’ subfolder
  title: 'Components/MyComponent',
};

const Template = (args) =>
  `<ch-button-group first="${args.first}" middle="${args.middle}" last="${args.last}"></ch-button-group>`;

export const Example = Template.bind({});

Example.args = {
  first: '@ch-ui',
  middle: '/',
  last: 'elements',
};
