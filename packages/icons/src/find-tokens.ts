// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { promisify } from 'node:util';
import { exec as execProcess } from 'node:child_process';
import { resolve } from 'node:path';
import { BundleParams } from './types';

const exec = promisify(execProcess);

export const findTokens = async ({
  source,
  token,
  path,
  content,
}: BundleParams) => {
  const grep = await exec(
    `grep -Eroh "${token}" ${resolve(__dirname, content)}`,
  );

  const tokens = new Set(grep.stdout.split('\n').filter(Boolean));

  return Array.from(tokens);
};
