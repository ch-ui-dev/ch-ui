// Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

export type BundleParams = {
  tokenPattern: string;
  getPath: (...matches: string[]) => string;
  spritePath: string;
  content: string;
};
