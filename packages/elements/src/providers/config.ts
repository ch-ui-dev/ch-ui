// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

// NOTE(thure): This was first a string constant, then a function, but since
//   functions aren’t serializeable, I chose a flat map instead, since symbol
//   ids often need to indicate which collection of assets to draw from anyway.
export type SpriteMap = Record<string, string>;

/**
 * A module namespace for configuring ch-ui throughout the runtime.
 */
class ChConfigProvider {
  /**
   * A record of sprite identifiers to `href` paths of SVG sprites, used in
   * `ch-icon`. A symbol identifier begins with a sprite identifier followed by
   * `--`, so a path is fetched by the first value. `default` can be specified
   * as a catchall if the sprite can’t be matched.
   */
  public sprites: SpriteMap = { default: '' };
}

export const chConfigProvider = new ChConfigProvider();
