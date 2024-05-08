// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ch-button',
  shadow: false,
})
export class ChButton {
  render() {
    return <Host role="button"></Host>;
  }
}
