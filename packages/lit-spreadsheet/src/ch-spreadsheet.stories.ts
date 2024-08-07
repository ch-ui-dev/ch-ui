// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import './ch-spreadsheet.ts';
import './ch-spreadsheet.pcss';

import { html } from 'lit';

export default {
  title: 'Elements/ch-spreadsheet',
};

export const Basic = () => html`<ch-spreadsheet></ch-spreadsheet>`;

Basic.args = {
  children: `Confirm`,
};
