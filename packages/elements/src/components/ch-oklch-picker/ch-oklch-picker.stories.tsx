// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import './ch-oklch-picker.css';

export default {
  title: 'Elements/ch-oklch-picker',
};

export const Basic = (args) =>
  `<ch-oklch-picker hue="${args.hue}" chroma="${args.chroma}" lightness="${args.lightness}"></ch-oklch-picker>`;

Basic.args = {
  hue: 240,
  chroma: 0.4,
  lightness: 0.5,
};
