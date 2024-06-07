// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import '../ch-button/ch-button.css';
import './ch-icon.css';

export default {
  title: 'Elements/ch-icon',
};

export const Basic = (args) =>
  `<ch-icon sprite="/assets/sprite.svg" symbol='${args.symbol}'></ch-icon>`;

Basic.args = {
  symbol: 'ph--feather--duotone',
};

export const Demo =
  () => `<div role='toolbar' class='ch-button-group' style='display:inline-flex;'>
  <ch-button>
    <ch-icon sprite="/assets/sprite.svg" symbol="ph--skip-back--fill"></ch-icon>
  </ch-button>
  <ch-button>
    <ch-icon sprite="/assets/sprite.svg" symbol="ph--rewind--fill" size="1.4em"></ch-icon>
  </ch-button>
  <ch-button>
    <ch-icon sprite="/assets/sprite.svg" symbol="ph--play--fill"></ch-icon>
  </ch-button>
  <ch-button>
    <ch-icon sprite="/assets/sprite.svg" symbol="ph--fast-forward--fill" size="1.4em"></ch-icon>
  </ch-button>
  <ch-button>
    <ch-icon sprite="/assets/sprite.svg" symbol="ph--skip-forward--fill"></ch-icon>
  </ch-button>
</div>`;

Demo.args = {};
