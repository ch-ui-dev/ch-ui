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
  { assetPath, symbolPattern, spritePath, config = {} }: BundleParams,
  symbols: Set<string>,
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

  const symbolExp = new RegExp(symbolPattern);

  await Promise.all(
    Array.from(symbols)
      .map((symbol) => {
        const match = symbol.match(symbolExp);
        if (match && match[1] && match[2]) {
          const [_, ...matches] = match;
          const svgPath = resolve(assetPath(...matches));
          return readFile(svgPath, 'utf-8').then((svg) =>
            sprite.add(symbol, symbol, svg),
          );
        } else {
          return null;
        }
      })
      .filter(Boolean),
  );
  const { result } = await sprite.compileAsync();
  return Promise.all(
    Object.values(result).flatMap((mode) =>
      Object.values(mode as Record<string, Resource>).map((resource) =>
        mkdir(dirname(resource.path), { recursive: true }).then(() =>
          writeFile(resource.path, resource.contents),
        ),
      ),
    ),
  );
};
