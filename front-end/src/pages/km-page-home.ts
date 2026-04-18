import { html, LitElement } from 'lit'

export class KmPageHome extends LitElement {
  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  protected render() {
    return html`<p>Welcome Home</p>`
  }
  protected createRenderRoot() {
    return this
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'km-page-home': KmPageHome
  }
}
