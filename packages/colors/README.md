# `@ch-ui/colors`

The colors package exports functions that help generate color systems by drawing an arc as helically transformed bézier curves through [OK Lab color space](https://bottosson.github.io/posts/oklab/). It uses the `colorsjs.io` package to convert between color spaces and output tokens for supported gamuts.

## Getting started

You might prefer to use this package via `@ch-ui/tokens`, which surfaces a more use-case oriented API.

```shell
pnpm add @ch-ui/colors
```

Then, use the exported functions as you like. Examples are provided below.

## Background

Most projects either inherit colors from a default set like Tailwind’s, or they have designers who manually select colors to use. Those approaches work fine for some, but there are others who both want customized color palettes *and* don’t have time to manually manage each and every shade in every gamut they want to support.

### Interpolating through color space

The main part of the solution this package implements is predicated on a few assumptions:

- a palette’s “true form” is not bound to a specific gamut, it exists in a perceptual color space; and
- a palette of colors can be represented as points on a path starting from black, passing through a definitive “key color”, and ending at white in a cylindrical model.

In order to preserve chromaticity (“saturation”/“colorfulness”), so that all the other shades don’t look markedly more muted than the key color, the path between the key color and either of the extremes should curve, therefore the arc is two continuous bézier curves that meet at the key color.

### Maintaining continuity while accommodating expressive aesthetics

Procedural color palettes often run into the “mustard problem”: in western cultures, if you reduce only the lightness of the prototypical shade of yellow and use that shade in a UI, users and designers find these shades unappealing. Essentially, there are zones of any gamut which folks prefer to avoid.

So that the arc has no sudden discontinuities and can be reasoned about as a smooth & differentiable shape in 3D space, this package supports applying *torsion* along the hue axis to the bézier curves. By applying torsion, a yellow color palette’s arc can gently twist toward the red part of the gamut as it gets darker, yielding procedural results that don’t exhibit any mustard shades.
