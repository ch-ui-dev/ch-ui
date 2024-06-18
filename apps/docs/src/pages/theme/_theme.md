---
title: 'Theming in @ch-ui'
layout: '../../layouts/DocsLayout.astro'
---
# `@ch-ui/theme`

Design systems often maintain an intentionally limited set of design tokens, such as:

- specific colors arranged in “palettes”,
- font sizes arranged in a “type scale” or “font ramp”.

These *physical* tokens are the most fundamental layer, naming specific scalar (numeric) values to use. The same tokens can be redefined within conditional at-rules e.g. to support broader gamuts like `rec2020`.

The base layer of physical tokens can then be built upon with a layer of *semantic* tokens, which map physical values guarded by conditional at-rules to one coherent meaningful name, for example `--fg-description` (for “foreground color: descriptions”) can map to one physical color by default or a different one when `prefers-color-palette: dark`.

## Layers & series

`ch-ui` understands design tokens as always having these two layers, physical and semantic, at their foundation, and always as arranging in series of values picked from intervals on otherwise seamless continuums.

`@ch-ui/theme` implements three kinds of series:

- *linear* for gaps, sizes, durations
- *exponential* for font sizes and the aforementioned
- *helical arc* for color palettes
