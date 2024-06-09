// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

// TODO(thure): This should be provided by the consumer somehow.
// @ts-ignore
import { renderToString } from '../../../elements/hydrate';

type StencilTag = {
  is: string;
};

function check(tag: StencilTag) {
  return tag.is.startsWith('ch-');
}

const body = /<body>(.+)<\/body>/;

function extractNode(html: string) {
  const result = html.match(body);
  return result?.[1] ?? '';
}

async function renderToStaticMarkup(
  tag: StencilTag,
  props: Record<string, string>,
  slots: Record<string, string>,
) {
  // TODO(thure): support slots
  const content = slots.default ?? '';
  const unrenderedHtml = `<${tag.is} ${Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')}>${content}</${tag.is}>`;
  const { html } = await renderToString(unrenderedHtml);
  return {
    html: extractNode(html),
  };
}

export default {
  check,
  renderToStaticMarkup,
};
