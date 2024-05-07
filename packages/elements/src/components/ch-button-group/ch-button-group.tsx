// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { Component, Prop, Host, h } from '@stencil/core';

@Component({
  tag: 'ch-button-group',
  shadow: false,
})
export class ChButtonGroup {
  /**
   * The first name
   */
  @Prop() first: string;

  /**
   * The middle name
   */
  @Prop() middle: string;

  /**
   * The last name
   */
  @Prop() last: string;

  private getText(): string {
    const { first, last } = this;
    return `${first} Apples ${last}`;
  }

  render() {
    return <Host>Hello, World! I'm {this.getText()}</Host>;
  }
}
