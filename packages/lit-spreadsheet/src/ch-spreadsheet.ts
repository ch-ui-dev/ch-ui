// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ref, createRef, Ref } from 'lit/directives/ref.js';

@customElement('ch-spreadsheet')
export class ChSpreadsheet extends LitElement {
  @state()
  position = { x: 0, y: 0 };

  @state()
  size = { inlineSize: 0, blockSize: 0 };

  @state()
  observer = new ResizeObserver((entries) => {
    this.size = entries?.[0]?.contentBoxSize?.[0] ?? {
      inlineSize: 0,
      blockSize: 0,
    };
  });

  viewportRef: Ref<HTMLDivElement> = createRef();

  override render() {
    return html`<div role="none" class="ch-spreadsheet">
      <div role="none" class="ch-spreadsheet__corner"></div>
      <div role="none" class="ch-spreadsheet__fixed-row">Column headings</div>
      <div role="none" class="ch-spreadsheet__corner"></div>
      <div role="none" class="ch-spreadsheet__fixed-column">123</div>
      <div
        role="none"
        class="ch-spreadsheet__viewport"
        ${ref(this.viewportRef)}
      >
        Size: ${this.size.inlineSize}, ${this.size.blockSize}
      </div>
      <div role="none" class="ch-spreadsheet__scrollbar--vertical">X</div>
      <div role="none" class="ch-spreadsheet__corner"></div>
      <div role="none" class="ch-spreadsheet__scrollbar--horizontal">X</div>
      <div role="none" class="ch-spreadsheet__corner"></div>
    </div>`;
  }

  override firstUpdated() {
    this.observer.observe(this.viewportRef.value!);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    console.log('[disconnected]', this.viewportRef.value);
    // TODO(thure): Will this even work?
    if (this.viewportRef.value) {
      this.observer.unobserve(this.viewportRef.value);
    }
  }

  override createRenderRoot() {
    return this;
  }
}
