// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import './ch-link.css';

export default {
  title: 'Elements/ch-button',
};

export const Basic = (args) => `<ch-button>${args.children}</ch-button>`;

Basic.args = {
  children: `Confirm`,
};

export const Group = (args) =>
  `<div role='group' class='ch-button-group'><ch-button>${args.left}</ch-button><ch-button>${args.right}</ch-button></div>`;

Group.args = {
  left: '←',
  right: '→',
};
