import { css, html, LitElement, nothing } from 'lit'
import { property } from 'lit/decorators.js'
import { formatTotalForCurrency } from '@/utils/currency.ts'
import { currentRoute, selectedCurrency, selectedKidSlug } from '@/constants/signals.ts'
import { SignalWatcher } from '@lit-labs/signals'
import { Route } from 'types'

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
  @property({ attribute: 'data-total', type: Number })
  adjustmentsTotal = 0

  /**
   * TODO
   */
  @property({ attribute: 'data-enable-link', type: Boolean })
  enableLink = false

  /**
   * TODO
   */
  @property({ attribute: 'data-name' })
  kidName = ''

  /**
   * TODO
   */
  @property({ attribute: 'data-slug' })
  kidSlug = ''

  /**
   * TODO
   */
  @property({ attribute: 'data-photo-url' })
  kidPhotoUrl = ''

  /**
   * =========================================================================
   * METHODS
   * =========================================================================
   */
  /**
   * TODO
   */
  private async _onLinkClick() {
    selectedKidSlug.set(this.kidSlug)
    currentRoute.set(Route.Adjustments)
  }

  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  protected render() {
    return html`
      <div class="container">
        <img src="${this.kidPhotoUrl}" alt="Avatar image for ${this.kidName}" width="150" height="150" />
        <h1>${this.kidName}</h1>
        <span>${formatTotalForCurrency(this.adjustmentsTotal, selectedCurrency.get())}</span>
        ${this.enableLink ? html`<button class="kid-link" @click="${this._onLinkClick}"></button>` : nothing}
        <currency-selector></currency-selector>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kid-total-card': KidTotalCard
  }
}
