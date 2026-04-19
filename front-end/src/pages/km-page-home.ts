import { html, LitElement } from 'lit'
import { kids } from '@/constants/signals.ts'
import { SignalWatcher } from '@lit-labs/signals'
import { Kid } from 'types'

export class KmPageHome extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  protected render() {
    const kidsJson = kids.get()

    if (kidsJson) {
      const kidsData: Kid[] = JSON.parse(kidsJson)

      const kidsCards = kidsData.map((kid, index) => {
        return html`<kid-total-card
          data-enable-link
          data-kid-index="${index}"
          data-name="${kid.name}"
          data-photo-url="${kid.photoUrl}"
          data-total="${kid.adjustments?.[0]?.totalToDate ?? 0}"
        ></kid-total-card>`
      })

      return html`${kidsCards}`
    }
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
