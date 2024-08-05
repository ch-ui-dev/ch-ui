# `@ch-ui/tailwind-tokens`

An adapter for using `@ch-ui/tokens` in Tailwind.

## Getting started

First, add to a project’s dev dependencies.

```shell
pnpm add -D @ch-ui/tailwind-tokens
```

Then, define how tokens you’ve configured with ch-ui should map to Tailwind theme keys.

```ts
import { type TailwindAdapterConfig } from '@ch-ui/tailwind-tokens';
// ...
export const myTokensAdapterConfig: TailwindAdapterConfig = {
  colors: {
    facet: 'my-colors',
    disposition: 'overwrite',
  },
}
// ...
```

Finally, extend your Tailwind theme with the adapter.

```ts
import tailwindcss from 'tailwindcss';
import adaptTokens from '@ch-ui/tailwind-tokens';
import chTokens from '@ch-ui/tokens';
import { myTokens, myTokensAdapterConfig } from './tokens-config';
// ...
config: async ({ root }, env) => {
  const content = root ? await resolveKnownPeers(config.content ?? [], root) : config.content;
  return {
    css: {
      postcss: {
        plugins: [
          // ...
          chTokens(myTokens),
          tailwindcss({
            content: ['./src/**/*.tsx'],
            theme: adaptTokens(myTokens, myTokensAdapterConfig)
          }),
          // ...
        ],
      },
    },
  };
}
// ...
```
