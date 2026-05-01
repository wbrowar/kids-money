import { css, html, LitElement } from 'lit'

/**
 * This wrapper component styles slotted labels and input elements.
 */
export class FormInput extends LitElement {
  /**
   * =========================================================================
   * CSS
   * =========================================================================
   */
  static styles = css`
    :host {
      display: grid;
      gap: 0.4rem;
    }
    ::slotted(label) {
      display: flex;
      gap: 0.3rem;
      align-items: center;
      font-size: var(--font-size-sm);
    }
    ::slotted(input) {
      font-size: var(--font-size-md);
    }
    ::slotted(select) {
      font-size: var(--font-size-sm);
    }
  `

  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  protected render() {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'form-input': FormInput
  }
}
