// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import './ch-icon.css';

export default {
  title: 'Elements/ch-icon',
};

export const Basic = (args) => `<ch-icon symbol='${args.symbol}'></ch-icon>`;

Basic.args = {
  symbol: 'ph--feather--duotone',
};

export const Demo =
  () => `<div role='toolbar' class='ch-button-group' style='display:inline-flex;'>
  <ch-button>
    <ch-icon symbol="ph--skip-back--regular"></ch-icon>
  </ch-button>
  <ch-button>
    <ch-icon symbol="ph--rewind--light" size="1.4em"></ch-icon>
  </ch-button>
  <ch-button>
    <ch-icon symbol="ph--play--regular"></ch-icon>
  </ch-button>
  <ch-button>
    <ch-icon symbol="ph--fast-forward--light" size="1.4em"></ch-icon>
  </ch-button>
  <ch-button>
    <ch-icon symbol="ph--skip-forward--regular"></ch-icon>
  </ch-button>
</div>`;

Demo.args = {};
