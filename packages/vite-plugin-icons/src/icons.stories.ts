// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

const SPRITE = '/assets/sprite.svg';

type IconName = string;
type IconVariant = 'bold' | 'duotone' | 'fill' | 'light' | 'regular' | 'thin';

type IconProps = {
  symbol: `ph--${IconName}--${IconVariant}`;
};

const Icon = ({ symbol }: IconProps) =>
  `<svg viewBox="0 0 256 256">
    <use href="${SPRITE}#${symbol}" />
  </svg>`;

export default { title: 'Icons' };

export const Icons = () => `
  <style>svg{ inline-size: 4rem; block-size: 4rem; display: inline-block; margin:.25rem; color: blue }</style>
  ${Icon({ symbol: 'ph--address-book--regular' })}
  ${Icon({ symbol: 'ph--planet--thin' })}
  ${Icon({ symbol: 'ph--anchor--bold' })}
  ${Icon({ symbol: 'ph--cards-three--light' })}
  ${Icon({ symbol: 'ph--map-pin-simple-area--duotone' })}
`;
