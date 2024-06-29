// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { BundleParams } from './types';

const split = /[\s\n"]+/m;

const scanFile = ({
  symbolPattern,
  contentPath,
}: Pick<BundleParams, 'symbolPattern'> & {
  contentPath: BundleParams['contentPaths'][number];
}): Promise<Set<string>> => {
  return new Promise((res, rej) => {
    const symbols = new Set<string>();
    let error = '';

    const grep = spawn('grep', [
      '-Eroh',
      `"${symbolPattern}"`,
      resolve(__dirname, contentPath),
    ]);

    grep.stdout.on('data', (data) => {
      data
        .toString()
        .split(split)
        .map((symbol: string) => symbol && symbols.add(symbol));
    });

    grep.stderr.on('data', (data) => {
      error += data.toString();
    });

    grep.on('close', () => {
      if (error) {
        rej(error);
      } else {
        res(symbols);
      }
    });
  });
};

export const scanFiles = ({
  symbolPattern,
  contentPaths,
}: Pick<BundleParams, 'symbolPattern' | 'contentPaths'> & {
  extension?: string;
}): Promise<Set<string>> =>
  Promise.all(
    contentPaths.map((contentPath) => scanFile({ symbolPattern, contentPath })),
  ).then((symbolSets) => {
    return symbolSets.reduce((acc, symbolSet) => {
      Array.from(symbolSet).forEach((symbol) => acc.add(symbol));
      return acc;
    }, new Set<string>());
  });
