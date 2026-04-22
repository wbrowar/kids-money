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
  static styles = css`
    :host {
      container-name: page;
      container-type: inline-size;
      display: block;
    }
    article {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }
    .kids {
      display: grid;
      gap: 2rem;
      width: 100%;
      max-width: 1200px;

      @container (width > 1000px) {
        & {
          grid-template-columns: 1fr 1fr;
        }
      }
    }
  `

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
        return html` <kid-total-card data-enable-link data-kid-index="${index}"></kid-total-card> `
      })

      return html` <article><section class="kids">${kidsCards}</section></article> `
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'km-page-home': KmPageHome
  }
}
