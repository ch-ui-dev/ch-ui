// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'ch-button',
  shadow: false,
  styleUrls: { default: ['./ch-button.css'] },
})
/**
 * A basic button component.
 */
export class ChButton {
  /**
   * The button variant.
   */
  @Prop() variant: string | undefined = undefined;

  render() {
    return <Host role="button" data-variant={this.variant} tabindex="0"></Host>;
  }
}
