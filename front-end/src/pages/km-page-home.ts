import { css, html, LitElement, nothing } from 'lit'
import { kids, kidsColors } from '@/constants/signals.ts'
import { SignalWatcher } from '@lit-labs/signals'
import { Kid } from '@types'

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

      const chart = html`<chart-adjustments-monthly data-kids-colors="${kidsColors.get()}"></chart-adjustments-monthly>`

      return html`
        <article>
          <section class="kids">${kidsCards}</section>
          <section class="chart">${chart}</section>
        </article>
      `
    }

    return nothing
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'km-page-home': KmPageHome
  }
}
