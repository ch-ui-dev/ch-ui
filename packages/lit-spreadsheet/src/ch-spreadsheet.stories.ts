// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import './ch-spreadsheet.ts';
import './ch-spreadsheet.pcss';

import { html } from 'lit';

export default {
  title: 'Elements/ch-spreadsheet',
};

export const Basic = ({ values }: { values: string }) =>
  html`<ch-spreadsheet values="${values}"></ch-spreadsheet>`;

Basic.args = {
  values: JSON.stringify({
    B2: 'Weekly sales report',
  }),
};
