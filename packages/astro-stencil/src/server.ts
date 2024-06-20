// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

// TODO(thure): This should be provided by the consumer somehow.
// @ts-ignore
import { renderToString } from '@ch-ui/elements/hydrate';

type StencilTag = {
  is: string;
};

function check(tag: StencilTag) {
  return tag.is.startsWith('ch-');
}

async function renderToStaticMarkup(
  tag: StencilTag,
  props: Record<string, string>,
  slots: Record<string, string>,
) {
  // TODO(thure): support slots
  if (Object.keys(slots).length > 1) {
    console.warn(
      '[@ch-ui/astro-stencil]',
      'Slots are not yet supported. Please help us implement them at https://github.com/ch-ui-dev/ch-ui',
    );
  }
  const content = slots.default ?? '';
  const { html } = await renderToString(
    `<${tag.is} ${Object.entries(props)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ')}>${content}</${tag.is}>`,
    { serializeShadowRoot: true, fullDocument: false },
  );
  return {
    html,
  };
}

export default {
  check,
  renderToStaticMarkup,
};
