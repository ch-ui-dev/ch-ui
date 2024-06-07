// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { Component, Host, h, Prop } from '@stencil/core';

/**
 * A regular `<a class="ch-link">` tag is preferred, however `<ch-link>` is
 * provided for the odd cases where an `<a>` tag’s default behavior is, for
 * whatever reason, undesirable.
 */
@Component({
  tag: 'ch-link',
  shadow: false,
  styleUrls: { default: ['./ch-link.css'] },
})
export class ChLink {
  /**
   * The variant.
   */
  @Prop() variant: string;
  /**
   * The `href`
   */
  @Prop() href: string;
  /**
   * The `target`
   */
  @Prop() target: string;

  private handleActivate(e) {
    if (e.type === 'click' || e.key === 'Enter') {
      const ref = e.target ?? e.srcElement;
      if (ref) {
        window.open(
          ref.getAttribute('data-href'),
          ref.getAttribute('data-target'),
        );
      }
    }
  }

  render() {
    return (
      <Host
        role="link"
        tabindex="0"
        onClick={this.handleActivate}
        onKeyDown={this.handleActivate}
        data-href={this.href}
        data-target={this.target}
        data-variant={this.variant}
      ></Host>
    );
  }
}
