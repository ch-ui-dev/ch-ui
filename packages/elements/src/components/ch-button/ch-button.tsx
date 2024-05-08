// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ch-button',
  shadow: false,
  styleUrls: { default: ['./ch-button.css'] },
})
export class ChButton {
  render() {
    return <Host role="button" tabindex="0"></Host>;
  }
}
