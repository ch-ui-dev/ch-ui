// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import { LitElement, html } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { ref, createRef, Ref } from 'lit/directives/ref.js';
import { colToA1Notation, posToA1Notation, rowToA1Notation } from './position';

const colSize = 64;

const rowSize = 20;

const gap = 0;

@customElement('ch-spreadsheet')
export class ChSpreadsheet extends LitElement {
  @property({ type: Object })
  values: Record<string, string> = {};

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
    const colMin = Math.floor(this.posInline / (colSize + gap));
    const colMax = Math.ceil(
      (this.sizeInline + this.posInline) / (colSize + gap),
    );
    const visibleCols = colMax - colMin;
    const offsetInline = colMin * colSize - this.posInline;

    const rowMin = Math.floor(this.posBlock / (rowSize + gap));
    const rowMax = Math.ceil(
      (this.sizeBlock + this.posBlock) / (rowSize + gap),
    );
    const visibleRows = rowMax - rowMin;
    const offsetBlock = rowMin * rowSize - this.posBlock;

    return html`<div role="none" class="ch-spreadsheet">
      <div role="none" class="ch-spreadsheet__corner"></div>
      <div role="none" class="ch-spreadsheet__columnheader">
        <div
          role="none"
          class="ch-spreadsheet__columnheader__content"
          style="transform:translate3d(${offsetInline}px,0,0);grid-template-columns:repeat(${visibleCols},${colSize}px);"
        >
          ${[...Array(visibleCols)].map((_, i) => {
            return html`<div
              role="gridcell"
              style="inline-size:${colSize}px;block-size:${rowSize}px;grid-column:${i +
              1}/${i + 2};"
            >
              ${colToA1Notation(colMin + i)}
            </div>`;
          })}
        </div>
      </div>
      <div role="none" class="ch-spreadsheet__corner"></div>
      <div role="none" class="ch-spreadsheet__rowheader">
        <div
          role="none"
          class="ch-spreadsheet__rowheader__content"
          style="transform:translate3d(0,${offsetBlock}px,0);"
        >
          ${[...Array(visibleRows)].map((_, j) => {
            return html`<div
              role="gridcell"
              style="block-size:${rowSize}px;grid-row:${j + 1}/${j + 2}"
            >
              ${rowToA1Notation(rowMin + j)}
            </div>`;
          })}
        </div>
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
          style="transform:translate3d(${offsetInline}px,${offsetBlock}px,0);grid-template-columns:repeat(${visibleCols},${colSize}px);grid-template-rows:repeat(${visibleRows},${rowSize}px);"
        >
          ${[...Array(visibleCols)].map((_, i) => {
            return [...Array(visibleRows)].map((_, j) => {
              const value = this.values[posToA1Notation(i, j)];
              return html`<div
                role="gridcell"
                style="inline-size:${colSize}px;block-size:${rowSize}px;grid-column:${i +
                1}/${i + 2};grid-row:${j + 1}/${j + 2}"
              >
                ${value}
              </div>`;
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
