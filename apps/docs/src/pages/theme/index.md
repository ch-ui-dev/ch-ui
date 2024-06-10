---
title: 'Theming in @ch-ui'
layout: '../../layouts/DocsLayout.astro'
---
# `@ch-ui/theme`

Design systems often maintain an intentionally limited set of design tokens, such as:

- specific colors arranged in *palettes*,
- font sizes arranged in a *type scale* or *font ramp*.

This base layer of *physical* tokens can then be built upon to produce *semantic* tokens, which can answer the question, for example, “what color is description text in dark mode, on a device supporting the P3 gamut, within an element that is modal?” by mapping physical values guarded by conditional at-rules to one coherent meaningful name, for example `--fg-description` (for “foreground color: descriptions”).

## Layers & series

`ch-ui` understands design tokens as always having these two layers, physical and semantic, at their foundation, and always as arranging in series of values picked from intervals on otherwise seamless continuums.

`@ch-ui/theme` implements three kinds of series:

- *linear* for gaps, sizes, durations
- *exponential* for font sizes and the aforementioned
- *helical arc* for color palettes
