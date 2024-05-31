// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'ch-icon',
  shadow: false,
  styleUrls: { default: ['./ch-icon.css'] },
})
/**
 * An icon component which uses an icon sprite.
 */
export class ChIcon {
  @Prop() sprite: string = global['chIconSprite'] ?? './icons.svg';
  @Prop() symbol: string;

  render() {
    return (
      <svg>
        <use href={`${this.sprite}#${this.symbol}`} />
      </svg>
    );
  }
}
