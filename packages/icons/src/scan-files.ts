// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { BundleParams } from './types';

const split = /[\s\n"]+/m;

const scanFile = ({
  tokenPattern,
  contentPath,
}: Pick<BundleParams, 'tokenPattern'> & {
  contentPath: BundleParams['contentPaths'][number];
}): Promise<Set<string>> => {
  return new Promise((res, rej) => {
    const tokens = new Set<string>();
    let error = '';

    const grep = spawn('grep', [
      '-Eroh',
      `"${tokenPattern}"`,
      resolve(__dirname, contentPath),
    ]);

    grep.stdout.on('data', (data) => {
      data
        .toString()
        .split(split)
        .map((token: string) => token && tokens.add(token));
    });

    grep.stderr.on('data', (data) => {
      error += data.toString();
    });

    grep.on('close', () => {
      if (error) {
        rej(error);
      } else {
        res(tokens);
      }
    });
  });
};

export const scanFiles = ({
  tokenPattern,
  contentPaths,
}: Pick<BundleParams, 'tokenPattern' | 'contentPaths'> & {
  extension?: string;
}): Promise<Set<string>> =>
  Promise.all(
    contentPaths.map((contentPath) => scanFile({ tokenPattern, contentPath })),
  ).then((tokenSets) => {
    return tokenSets.reduce((acc, tokenSet) => {
      Array.from(tokenSet).forEach((token) => acc.add(token));
      return acc;
    }, new Set<string>());
  });
