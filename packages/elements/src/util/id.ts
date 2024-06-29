// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import alea from 'alea';

interface PrngFactory {
  new (seed?: string): () => number;
}

const Alea: PrngFactory = alea as unknown as PrngFactory;

const prng = new Alea('@ch-ui/elements');

export const randomString = (n = 4) =>
  prng()
    .toString(16)
    .slice(2, n + 2);

export const id = (
  namespace: string,
  propsId?: string,
  opts?: Partial<{ n: number }>,
) => propsId ?? `${namespace}-${randomString(opts?.n ?? 4)}`;
