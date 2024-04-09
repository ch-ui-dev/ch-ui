// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { BundleParams } from './types';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import svgstore from 'svgstore';

export const makeSprite = async (
  { getPath, tokenPattern, spritePath }: BundleParams,
  tokens: Set<string>,
) => {
  const tokenExp = new RegExp(tokenPattern);
  // TODO(thure): Make this configurable.
  const sprite = svgstore({ symbolAttrs: { fill: 'currentColor' } });
  await Promise.all(
    Array.from(tokens)
      .map((token) => {
        const match = token.match(tokenExp);
        if (match && match[1] && match[2]) {
          const [_, ...matches] = match;
          return readFile(
            resolve(__dirname, getPath(...matches)),
            'utf-8',
          ).then((svg) => sprite.add(token, svg));
        } else {
          return null;
        }
      })
      .filter(Boolean),
  );
  const resolvedSpritePath = resolve(__dirname, spritePath);
  await mkdir(dirname(resolvedSpritePath), { recursive: true });
  return writeFile(resolve(__dirname, spritePath), sprite.toString());
};
