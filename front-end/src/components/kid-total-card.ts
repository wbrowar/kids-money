import { css, html, LitElement, nothing } from 'lit'
import { property } from 'lit/decorators.js'
import { formatTotalForCurrency } from '@/utils/currency.ts'
import { currentRoute, kids, selectedCurrency, selectedKidIndex } from '@/constants/signals.ts'
import { SignalWatcher } from '@lit-labs/signals'
import { Kid, Route } from 'types'

export class KidTotalCard extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * CSS
   * =========================================================================
   */
  static styles = css`
    :host {
      container-name: kid-total-card;
      container-type: inline-size;
      position: relative;
    }

    img {
      display: block;
      max-width: 100%;
      border-radius: 50%;
    }
    .kid-link {
      appearance: none;
      display: block;
      position: absolute;
      inset: 0;
      background-color: rgb(255 0 0 / 0.62);
      cursor: pointer;
    }
    currency-selector {
      position: relative;
    }
  `

  /**
   * =========================================================================
   * PROPS
   * =========================================================================
   */
  /**
   * TODO
   */
  @property({ attribute: 'data-enable-link', type: Boolean })
  enableLink = false

  /**
   * TODO
   */
  @property({ attribute: 'data-kid-index' })
  kidIndex = 0

  /**
   * =========================================================================
   * METHODS
   * =========================================================================
   */
  /**
   * TODO
   */
  private async _onLinkClick() {
    selectedKidIndex.set(this.kidIndex)
    currentRoute.set(Route.Adjustments)
  }

  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  protected render() {
    const kidsJson = kids.get()

    if (kidsJson) {
      const kidsData: Kid[] = JSON.parse(kidsJson)
      const kid = kidsData[this.kidIndex]
      const kidTotalValue = kid.adjustments?.[0]?.totalToDate ?? 0

      return html`
        <div class="container">
          <img src="${kid.photoUrl}" alt="Avatar image for ${kid.name}" width="150" height="150" />
          <h1>${kid.name}</h1>
          <span>${formatTotalForCurrency(kidTotalValue, selectedCurrency.get())}</span>
          ${this.enableLink ? html`<button class="kid-link" @click="${this._onLinkClick}"></button>` : nothing}
          <currency-selector></currency-selector>
        </div>
      `
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kid-total-card': KidTotalCard
  }
}
