// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { renderToString } from '@ch-ui/elements/hydrate';

function check(tag: { is: string }) {
  return tag.is.startsWith('ch-');
}

function renderToStaticMarkup() {
  return { html: '<span>Hello</span>' };
}

export default {
  check,
  renderToStaticMarkup,
};
