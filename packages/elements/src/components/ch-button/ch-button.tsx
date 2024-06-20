// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { Component, Host, h, Prop } from '@stencil/core';

/**
 * A basic button component. Supports grouping when arranged as direct children
 * of an element with `class~=ch-button-group`.
 */
@Component({
  tag: 'ch-button',
  shadow: false,
  // styleUrls: { default: ['./ch-button.css'] },
})
export class ChButton {
  /**
   * The button variant.
   */
  @Prop() variant: string;

  render() {
    return <Host role="button" data-variant={this.variant} tabindex="0"></Host>;
  }
}
