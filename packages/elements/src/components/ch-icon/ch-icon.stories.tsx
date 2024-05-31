// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import './ch-icon.css';

export default {
  title: 'Elements/ch-icon',
};

export const Basic = (args) =>
  `<ch-icon sprite="./assets/sprite.svg" symbol='${args.symbol}'></ch-icon>`;

Basic.args = {
  symbol: 'ph--feather--duotone',
};

export const Demo = () => `<div role='toolbar' class='ch-button-group'>
  <ch-button>
    <ch-icon sprite="./assets/sprite.svg" symbol="ph--skip-back--regular"></ch-icon>
  </ch-button>
  <ch-button>
    <ch-icon sprite="./assets/sprite.svg" symbol="ph--rewind--regular"></ch-icon>
  </ch-button>
  <ch-button>
    <ch-icon sprite="./assets/sprite.svg" symbol="ph--play--regular"></ch-icon>
  </ch-button>
  <ch-button>
    <ch-icon sprite="./assets/sprite.svg" symbol="ph--fast-forward--regular"></ch-icon>
  </ch-button>
  <ch-button>
    <ch-icon sprite="./assets/sprite.svg" symbol="ph--skip-forward--regular"></ch-icon>
  </ch-button>
</div>`;

Demo.args = {};
