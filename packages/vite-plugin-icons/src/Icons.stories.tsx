// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import React from 'react';

const SPRITE = './sprite.svg';

type IconName = string;
type IconVariant = 'bold' | 'duotone' | 'fill' | 'light' | 'regular' | 'thin';

const Icon = ({ icon }: { icon: `ph-icon--${IconName}--${IconVariant}` }) => {
  return (
    <svg viewBox="0 0 256 256">
      <use href={`${SPRITE}#${icon}`} />
    </svg>
  );
};

export default { title: 'icons' };

export const Icons = () => {
  return <Icon icon="ph-icon--address-book--regular" />;
};
