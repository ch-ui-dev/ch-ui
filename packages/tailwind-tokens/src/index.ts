// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { ThemeConfig as TwTheme } from 'tailwindcss/types/config';
import { TokenSet } from '@ch-ui/tokens';

export type TailwindAdapterConfig = Partial<
  Record<
    keyof TwTheme,
    {
      facet: string;
      disposition?: 'extend' | 'overwrite';
      excludeNamespace?: boolean;
      // TODO(thure): This seems dumb, and Tailwind accepts other shapes than 'var(--etc)', how can this be better? Callbacks?
      lineHeightFacet?: string;
    }
  >
>;

const defaultAdapterConfig = {} satisfies TailwindAdapterConfig;

export default (
  tokensConfig: TokenSet,
  adapterConfig: TailwindAdapterConfig = defaultAdapterConfig,
): Partial<TwTheme> => {
  return Object.entries(adapterConfig).reduce(
    (acc: Partial<TwTheme>, [twKey, config]) => {
      acc[twKey as keyof TwTheme] = {};
      return acc;
    },
    {},
  );
};
