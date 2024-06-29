# `ch-ui`

Someone asked for this design system toolchain. Was it you?

## Benefits

- Dependency-free procedurally generated color palettes in sRGB or P3 ([`@ch-ui/colors`](https://www.npmjs.com/package/@ch-ui/colors))

## Drawbacks

- Not much here just yet.

## To do

- [x] [`@ch-ui/colors`](https://www.npmjs.com/package/@ch-ui/colors): procedural color palette tooling
- [x] `@ch-ui/icons`: icon sprite tooling
- [ ] `@ch-ui/elements`: lower-level accessible[¹](#footnotes) elements
- [ ] `@ch-ui/tokens`: a theme for the elements that is reasonably barebones

See the issues for other items.

## Footnotes

1. [Any claim to “accessibility” should be vetted](https://hidde.blog/accessible-front-end-components-claims-vs-reality/), specifically please check that `ch-ui` is inclusive in the ways it needs to be for your users.

## License

All packages in this project are licensed under a modification of the [Big Time Public License, Version 2.0.0](https://bigtimelicense.com/versions/2.0.0) (it is therefore *not* that license, rather “Ch Public License”), adding a clause precluding the use of this software to train AI or any other kind of machine learning algorithm.
