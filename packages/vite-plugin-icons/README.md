# `@ch-ui/vite-plugin-icons`

A Vite plugin for spriting icons used in your project in a Tailwind-like way.

## Install & configure

```shell
pnpm add -D @ch-ui/vite-plugin-icons
```

```ts
import IconsPlugin from '@ch-ui/vite-plugin-icons';
// ...
export default defineConfig((env) => ({
  // The plugin will put the sprite in the project’s `publicDir`
  publicDir: resolve(__dirname, '../dist/assets'),
  // ...
  plugins: [
    // ...
    IconsPlugin({
      // Define the regular expression for the symbols you intend to use for your project; the expression must capture any strings you need to determine the path to the SVG asset.
      symbolPattern:
        'ph-icon--([a-z]+[a-z-]*)--(bold|duotone|fill|light|regular|thin)',
      // The matches in your regular expression are spread onto `assetPath` which must return the path to the SVG file specified by the symbol.
      assetPath: (name, variant) =>
        `./packages/icons/node_modules/@phosphor-icons/core/assets/${variant}/${name}${
          variant === 'regular' ? '' : `-${variant}`
        }.svg`,
      // Tell the plugin how to name the sprite.
      spriteFile: 'sprite.svg',
      // Tell the plugin in which files to look for icon symbols.
      contentPaths: ['**/*.stories.tsx'],
    }),
    // ...
  ],
}));
// ...
```

## Usage example

The following example is provided for a React component, but this plugin will work for any text content you might happen to use.

```tsx
import React, { ComponentPropsWithRef, forwardRef } from 'react';

const SPRITE = './assets/sprite.svg';

type IconName = string;
type IconVariant = 'bold' | 'duotone' | 'fill' | 'light' | 'regular' | 'thin';

type IconProps = ComponentPropsWithRef<'svg'> & {
  symbol: `ph-icon--${IconName}--${IconVariant}`;
};

const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ symbol, ...props }, forwardedRef) => {
    return (
      <svg viewBox="0 0 256 256" {...props} ref={forwardedRef}>
        <use href={`${SPRITE}#${symbol}`} />
      </svg>
    );
  },
);

export const ExampleIcons = () => {
  return (
    <>
      <style>{`
        svg{ inline-size: 4rem; block-size: 4rem; display: inline-block; margin:.25rem; color: blue }
      `}</style>
      <Icon symbol="ph-icon--address-book--regular" />
      <Icon symbol="ph-icon--planet--thin" />
      <Icon symbol="ph-icon--anchor--bold" />
      <Icon symbol="ph-icon--cards-three--light" />
      <Icon symbol="ph-icon--map-pin-simple-area--duotone" />
    </>
  );
};
```
