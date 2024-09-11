# `@ch-ui/vite-plugin-tokens`

A Vite plugin which uses `@ch-ui/tokens` to configure & build a set of CSS tokens.

## Getting started

Add to your app’s dev dependencies.

```shell
pnpm add -D @ch-ui/vite-plugin-tokens
```

Then add to your app’s Vite config.

```ts
import chTokensPlugin, { defaultTokenSet } from '@ch-ui/vite-plugin-tokens';
// ...
  plugins: [
    // ...
    chTokensPlugin({
      config: (tokenSetName: string) => {
        switch(tokenSetName){
          case 'my-tokens':
          default:
            return defaultTokenSet;
        }
      },
    })
  ]
```

Then use the `@tokens` at-rule to invoke the plugin.

```css
@layer tokens {
  @tokens my-token-set;
}
```
