// Required notice: Copyright (c) 2024, Will Shown <ch-ui@willshown.com>

import {
  Component,
  h,
  Prop,
  Host,
  State,
  Listen,
  Event,
  EventEmitter,
} from '@stencil/core';
import { id } from '../../util';

export type Oklch = {
  hue: number;
  chroma: number;
  lightness: number;
};

/**
 * An icon component which uses an icon sprite.
 */
@Component({
  tag: 'ch-oklch-picker',
  shadow: false,
  styleUrls: { default: ['./ch-oklch-picker.css'] },
})
export class ChOklchPicker {
  /**
   * The hue of the color in OK Lch
   */
  @Prop() hue: string;
  /**
   * The chroma of the color in OK Lch
   */
  @Prop() chroma: string;
  /**
   * The lightness of the color in OK Lch
   */
  @Prop() lightness: string;

  @State() hueState: number = 0;
  @State() chromaState: number = 0;
  @State() lightnessState: number = 0;

  private hueLabel: string = id('hue');
  private chromaLabel: string = id('chroma');
  private lightnessLabel: string = id('lightness');

  hueNumberInput!: HTMLInputElement;
  hueRangeInput!: HTMLInputElement;
  chromaNumberInput!: HTMLInputElement;
  chromaRangeInput!: HTMLInputElement;
  lightnessNumberInput!: HTMLInputElement;
  lightnessRangeInput!: HTMLInputElement;

  connectedCallback() {
    this.hueState = parseFloat(this.hue);
    this.chromaState = parseFloat(this.chroma);
    this.lightnessState = parseFloat(this.lightness);
  }

  componentDidRender() {
    // NOTE(thure): This appears to be necessary because stencil doesn’t programmatically
    //   update `value` on range inputs like it does for number inputs.
    console.log('[component did render]');
    this.hueNumberInput.value = `${this.hueState}`;
    this.hueRangeInput.value = `${this.hueState}`;
    this.chromaNumberInput.value = `${this.chromaState}`;
    this.chromaRangeInput.value = `${this.chromaState}`;
    this.lightnessNumberInput.value = `${this.lightnessState}`;
    this.lightnessRangeInput.value = `${this.lightnessState}`;
  }

  @Event() oklchChange: EventEmitter<Oklch>;

  @Listen('change', { passive: true })
  handleValueChange(event: Event) {
    if ('getAttribute' in event.target) {
      const target = event.target as HTMLInputElement;
      const property = target.getAttribute('property');
      const value = parseFloat(target.value);
      switch (property) {
        case 'hue':
          this.hueState = value;
          break;
        case 'chroma':
          this.chromaState = value;
          break;
        case 'lightness':
          this.lightnessState = value;
          break;
      }
      switch (property) {
        case 'hue':
        case 'chroma':
        case 'lightness':
          return this.oklchChange.emit({
            hue: this.hueState,
            chroma: this.chromaState,
            lightness: this.lightnessState,
          });
      }
    }
  }

  render() {
    return (
      <Host role="group">
        <label id={this.hueLabel}>Hue (0–360)</label>
        <input
          property="hue"
          aria-labelledby={this.hueLabel}
          ref={(el) => (this.hueNumberInput = el as HTMLInputElement)}
          type="number"
          min="0"
          max="360"
          step="1"
        />
        <input
          property="hue"
          aria-labelledby={this.hueLabel}
          ref={(el) => (this.hueRangeInput = el as HTMLInputElement)}
          type="range"
          min="0"
          max="360"
          step="1"
        />

        <label id={this.chromaLabel}>Chroma (0–0.4)</label>
        <input
          property="chroma"
          aria-labelledby={this.chromaLabel}
          ref={(el) => (this.chromaNumberInput = el as HTMLInputElement)}
          type="number"
          min="0.000"
          max="0.400"
          step="0.004"
        />
        <input
          property="chroma"
          aria-labelledby={this.chromaLabel}
          ref={(el) => (this.chromaRangeInput = el as HTMLInputElement)}
          type="range"
          min="0.000"
          max="0.400"
          step="0.004"
        />

        <label id={this.lightnessLabel}>Lightness (0–1)</label>
        <input
          property="lightness"
          aria-labelledby={this.lightnessLabel}
          ref={(el) => (this.lightnessNumberInput = el as HTMLInputElement)}
          type="number"
          min="0.00"
          max="1.00"
          step="0.01"
        />
        <input
          property="lightness"
          aria-labelledby={this.lightnessLabel}
          ref={(el) => (this.lightnessRangeInput = el as HTMLInputElement)}
          type="range"
          min="0.00"
          max="1.00"
          step="0.01"
        />
      </Host>
    );
  }
}
