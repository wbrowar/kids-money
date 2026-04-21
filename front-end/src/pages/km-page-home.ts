import { css, html, LitElement } from 'lit'
import { kids } from '@/constants/signals.ts'
import { SignalWatcher } from '@lit-labs/signals'
import { Kid } from 'types'

export class KmPageHome extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * CSS
   * =========================================================================
   */
  static styles = css``

  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  protected render() {
    const kidsJson = kids.get()

    if (kidsJson) {
      const kidsData: Kid[] = JSON.parse(kidsJson)

      const kidsCards = kidsData.map((_kid, index) => {
        return html`<kid-total-card data-enable-link data-kid-index="${index}"></kid-total-card>`
      })

      return html`${kidsCards}`
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'km-page-home': KmPageHome
  }
}
