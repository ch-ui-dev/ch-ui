// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { Component, h, Prop } from '@stencil/core';
import { chConfigProvider } from '../../providers';

@Component({
  tag: 'ch-icon',
  shadow: false,
  styleUrls: { default: ['./ch-icon.css'] },
})
/**
 * An icon component which uses an icon sprite.
 */
export class ChIcon {
  @Prop() sprite: string = chConfigProvider.sprite ?? './icons.svg';
  @Prop() symbol: string;
  @Prop() size: string = '1em';

  render() {
    return (
      <svg style={{ blockSize: this.size, inlineSize: this.size }}>
        <use href={`${this.sprite}#${this.symbol}`} />
      </svg>
    );
  }
}
