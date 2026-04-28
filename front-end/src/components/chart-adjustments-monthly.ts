import { css, html, LitElement } from 'lit'
import { query } from 'lit/decorators.js'
import { SignalWatcher } from '@lit-labs/signals'

export class ChartAdjustmentsMonthly extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * CSS
   * =========================================================================
   */
  static styles = css`
    :host {
      display: block;
      width: 100cqw;
    }
  `

  /**
   * =========================================================================
   * REFS
   * =========================================================================
   */
  @query('#chart')
  _chart!: HTMLInputElement

  /**
   * =========================================================================
   * STATE
   * =========================================================================
   */

  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  protected render() {
    return html`<p></p>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chart-adjustments-monthly': ChartAdjustmentsMonthly
  }
}
