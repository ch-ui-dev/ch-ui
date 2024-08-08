// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ref, createRef, Ref } from 'lit/directives/ref.js';

const colwidth = 64;

const rowheight = 20;

function toColName(n: number): string {
  return `C${n}`;
}
function toRowName(n: number): string {
  return `${n}`;
}

@customElement('ch-spreadsheet')
export class ChSpreadsheet extends LitElement {
  @state()
  posInline = 0;
  @state()
  posBlock = 0;

  @state()
  sizeInline = 0;
  @state()
  sizeBlock = 0;

  @state()
  observer = new ResizeObserver((entries) => {
    const { inlineSize, blockSize } = entries?.[0]?.contentBoxSize?.[0] ?? {
      inlineSize: 0,
      blockSize: 0,
    };
    this.sizeInline = inlineSize;
    this.sizeBlock = blockSize;
  });

  viewportRef: Ref<HTMLDivElement> = createRef();

  handleWheel = ({ deltaX, deltaY }: WheelEvent) => {
    this.posInline = Math.max(0, this.posInline + deltaX);
    this.posBlock = Math.max(0, this.posBlock + deltaY);
  };

  override render() {
    const visibleCols = Math.ceil(
      (this.sizeInline + this.posInline) / colwidth,
    );
    const visibleRows = Math.ceil((this.sizeBlock + this.posBlock) / rowheight);
    return html`<div role="none" class="ch-spreadsheet">
      <div role="none" class="ch-spreadsheet__corner"></div>
      <div
        role="none"
        class="ch-spreadsheet__columnheader"
        style="transform:translate3d(-${this.posInline}px,0,0)"
      >
        ${[...Array(visibleCols)].map((_, i) => {
          return html`<div
            role="gridcell"
            style="inline-size:${colwidth}px;block-size:${rowheight}px;"
          >
            ${toColName(i)}
          </div>`;
        })}
      </div>
      <div role="none" class="ch-spreadsheet__corner"></div>
      <div
        role="none"
        class="ch-spreadsheet__rowheader"
        style="transform:translate3d(0,-${this.posBlock}px,0)"
      >
        ${[...Array(visibleRows)].map((_, j) => {
          return html`<div role="gridcell" style="block-size:${rowheight}px;">
            ${toRowName(j)}
          </div>`;
        })}
      </div>
      <div
        role="none"
        class="ch-spreadsheet__viewport"
        @wheel="${this.handleWheel}"
        ${ref(this.viewportRef)}
      >
        <div
          role="grid"
          class="ch-spreadsheet__content"
          style="transform:translate3d(-${this.posInline}px,-${this
            .posBlock}px,0)"
        >
          ${[...Array(visibleCols)].map((_, i) => {
            return [...Array(visibleRows)].map((_, j) => {
              return html`<div
                role="gridcell"
                style="inline-size:${colwidth}px;block-size:${rowheight}px;grid-column:${i +
                1}/${i + 2};grid-row:${j + 1}/${j + 2}"
              ></div>`;
            });
          })}
        </div>
      </div>
      <div
        role="none"
        class="ch-spreadsheet__scrollbar"
        aria-orientation="vertical"
      >
        <div role="none" class="ch-spreadsheet__scrollbar__thumb"></div>
      </div>
      <div role="none" class="ch-spreadsheet__corner"></div>
      <div
        role="none"
        class="ch-spreadsheet__scrollbar"
        aria-orientation="horizontal"
      >
        <div role="none" class="ch-spreadsheet__scrollbar__thumb"></div>
      </div>
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
