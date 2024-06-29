# `@ch-ui/vite-plugin-tokens`

A Vite plugin which uses `@ch-ui/tokens` to configure & build a set of CSS tokens.

## Getting started

Add to your app’s dev dependencies.

```shell
pnpm add -D @ch-ui/vite-plugin-tokens
```

Then add to your app’s Vite config.

```ts
import chThemePlugin, { defaultTheme } from '@ch-ui/vite-plugin-tokens';
// ...
  plugins: [
    // ...
    chThemePlugin({
      config: (tokenSetName: string) => {
        switch(tokenSetName){
          case 'my-theme':
          default:
            return defaultTheme;
        }
      },
    })
  ]
```

Then use the `@chui` at-rule to invoke the plugin.

```css
@layer tokens {
  @chui my-theme;
}
```
