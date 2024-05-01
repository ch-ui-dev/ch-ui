// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: false,
})
export class MyComponent {
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
    const { first, middle, last } = this;
    return `${first} ${middle} ${last}`;
  }

  render() {
    return <div>Hello, World! I'm {this.getText()}</div>;
  }
}
