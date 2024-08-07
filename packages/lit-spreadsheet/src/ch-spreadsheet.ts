// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ch-spreadsheet')
export class ChSpreadsheet extends LitElement {
  @property()
  version = 'STARTING';

  override render() {
    return html`
      <p>Welcome to the Lit tutorial!</p>
      <p>This is the ${this.version} code.</p>
    `;
  }

  override createRenderRoot() {
    return this;
  }
}
