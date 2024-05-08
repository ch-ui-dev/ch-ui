// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ch-button-group',
  shadow: false,
})
export class ChButtonGroup {
  render() {
    return <Host role="group"></Host>;
  }
}
