// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { BundleParams } from './types';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import SVGSpriter from 'svg-sprite';

type Resource = {
  path: string;
  contents: string;
};

export const makeSprite = async (
  { assetPath, tokenPattern, spritePath, config = {} }: BundleParams,
  tokens: Set<string>,
) => {
  const resolvedSpritePath = resolve(spritePath);

  const sprite = new SVGSpriter({
    dest: dirname(resolvedSpritePath),
    mode: {
      symbol: { dest: '.', sprite: basename(resolvedSpritePath) },
      ...config.mode,
    },
    ...config,
  });

  const tokenExp = new RegExp(tokenPattern);

  await Promise.all(
    Array.from(tokens)
      .map((token) => {
        const match = token.match(tokenExp);
        if (match && match[1] && match[2]) {
          const [_, ...matches] = match;
          const svgPath = resolve(assetPath(...matches));
          return readFile(svgPath, 'utf-8').then((svg) =>
            sprite.add(token, token, svg),
          );
        } else {
          return null;
        }
      })
      .filter(Boolean),
  );
  const { result } = await sprite.compileAsync();
  for (const mode of Object.values(result)) {
    for (const resource of Object.values(mode as Record<string, Resource>)) {
      await mkdir(dirname(resource.path), { recursive: true });
      await writeFile(resource.path, resource.contents);
    }
  }
};
