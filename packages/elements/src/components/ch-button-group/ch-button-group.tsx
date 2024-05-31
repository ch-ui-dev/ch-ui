// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ch-button-group',
  shadow: false,
  styleUrls: { default: ['./ch-button-group.css'] },
})
/**
 * A way of grouping buttons. If the
 */
export class ChButtonGroup {
  render() {
    return <Host role="group"></Host>;
  }
}
