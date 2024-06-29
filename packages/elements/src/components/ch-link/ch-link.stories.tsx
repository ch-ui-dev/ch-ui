// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import './ch-link.css';

export default {
  title: 'Elements/ch-link',
};

export const Basic = (args) =>
  `<a href="#" class="ch-link">${args.children}</a>`;

Basic.args = {
  children: `Resources`,
};
