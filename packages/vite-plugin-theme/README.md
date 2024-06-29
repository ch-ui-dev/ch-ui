# `@ch-ui/vite-plugin-theme`

A Vite plugin which uses `@ch-ui/theme` to configure & build a set of CSS tokens.

## Getting started

Add to your app’s dev dependencies.

```shell
pnpm add -D @ch-ui/vite-plugin-theme
```

Then add to your app’s Vite config.

```ts
import chThemePlugin, { defaultTheme } from '@ch-ui/vite-plugin-theme';
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
