import { html, LitElement } from 'lit'
import { SignalWatcher } from '@lit-labs/signals'
import { kids, selectedKidIndex } from '@/constants/signals.ts'
import { Kid } from 'types'

export class KmPageAdjustments extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  protected render() {
    const kidsJson = kids.get()

    if (kidsJson) {
      const kidsData: Kid[] = JSON.parse(kidsJson)
      const kid = kidsData[selectedKidIndex.get()]

      const kidCards = html`<kid-total-card
        data-name="${kid.name}"
        data-photo-url="${kid.photoUrl}"
        data-kid-index="${selectedKidIndex.get()}"
        data-total="${kid.adjustments?.[0]?.totalToDate ?? 0}"
      ></kid-total-card>`

      return html`${kidCards}`
    }
  }
  protected createRenderRoot() {
    return this
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'km-page-adjustments': KmPageAdjustments
  }
}
