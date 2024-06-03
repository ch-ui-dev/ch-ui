// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

/**
 * A module namespace for configuring ch-ui throughout the runtime.
 */
class ChConfigProvider {
  /**
   * A fallback `ch-icon` should use if a prop of the same name is not provided.
   */
  public sprite = '';
}

export const chConfigProvider = new ChConfigProvider();
