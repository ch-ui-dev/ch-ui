// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

const SPRITE = '/assets/sprite.svg';

type IconName = string;
type IconVariant = 'bold' | 'duotone' | 'fill' | 'light' | 'regular' | 'thin';

type IconProps = {
  token: `ph--${IconName}--${IconVariant}`;
};

const Icon = ({ token }: IconProps) =>
  `<svg viewBox="0 0 256 256">
    <use href="${SPRITE}#${token}" />
  </svg>`;

export default { title: 'Icons' };

export const Icons = () => `
  <style>svg{ inline-size: 4rem; block-size: 4rem; display: inline-block; margin:.25rem; color: blue }</style>
  ${Icon({ token: 'ph--address-book--regular' })}
  ${Icon({ token: 'ph--planet--thin' })}
  ${Icon({ token: 'ph--anchor--bold' })}
  ${Icon({ token: 'ph--cards-three--light' })}
  ${Icon({ token: 'ph--map-pin-simple-area--duotone' })}
`;
