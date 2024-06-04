// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { Component, h, Prop, Host } from '@stencil/core';
import { chConfigProvider } from '../../providers';

const SPRITE_SEPARATOR = '--';

function resolveSprite(symbol?: string) {
  const identifier = symbol?.split(SPRITE_SEPARATOR)[0];
  if (identifier in chConfigProvider.sprites) {
    return chConfigProvider.sprites[identifier];
  } else {
    return chConfigProvider.sprites.default;
  }
}

@Component({
  tag: 'ch-icon',
  shadow: false,
  styleUrls: { default: ['./ch-icon.css'] },
})
/**
 * An icon component which uses an icon sprite.
 */
export class ChIcon {
  /**
   * The path to the .svg file to pass to `href`. This will default to a value
   * returned by `chConfigProvider.sprite` if not given as a prop, or to
   * `'/icons.svg'` if neither is provided.
   */
  @Prop() sprite: string;
  @Prop() symbol: string;
  @Prop() size: string = '1em';

  render() {
    const sprite = this.sprite ?? resolveSprite(this.symbol) ?? '/icons.svg';
    return (
      <Host role="none">
        <svg style={{ blockSize: this.size, inlineSize: this.size }}>
          <use href={`${sprite}#${this.symbol}`} />
        </svg>
      </Host>
    );
  }
}
