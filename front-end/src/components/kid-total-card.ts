import { css, html, LitElement, nothing } from 'lit'
import { property } from 'lit/decorators.js'
import { formatTotalForCurrency } from '@/utils/currency.ts'
import { currentRoute, kids, selectedCurrency, selectedKidIndex } from '@/signals.ts'
import { SignalWatcher } from '@lit-labs/signals'
import { Kid } from '@types'
import { classMap } from 'lit/directives/class-map.js'
import { variableKids } from '@/assets/css/css.ts'
import { Route } from '@/constants/router.ts'
import { emojiRegex } from '@/constants/string-helper.ts'

/**
 * Cards that show the image of a kid, their name, their current total, and a progress meter, showing how close they are to their savings goal.
 */
export class KidTotalCard extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * CSS
   * =========================================================================
   */
  static styles = [
    variableKids,
    css`
      :host {
        display: contents;
      }
      img {
        display: block;
        max-width: 100%;
        height: auto;
      }
      .container {
        container-name: kid-total-card;
        container-type: inline-size;
        display: grid;
        grid-template-columns: max-content 1fr max-content;
        grid-template-rows: calc(max-content - 20px) max-content max-content;
        gap: 10px 40px;
        padding: 11px;
        position: relative;
        border-radius: var(--border-radius-lg);
        background-color: var(--kid-color-favorite);
        box-shadow: var(--kid-box-shadow-card);
      }
      .bg {
        grid-column: 1 / 4;
        grid-row: 1 / 3;
        background-color: var(--kid-color-bg-light);
        background-image: var(--kid-color-bg-gradient);
        border-radius: var(--border-radius-md);
      }
      .avatar {
        display: block;
        grid-column: 1 / 2;
        grid-row: 1 / 2;
        //transform: translateX(20px) translateY(-40px);
        transform: translateX(20%) translateY(-15%) scale(1.2);

        img {
          border-radius: 50%;
          aspect-ratio: 1;
          border: 5px solid var(--kid-color-border);
          width: clamp(60px, 20cqw, 150px);
        }
      }
      .info {
        display: grid;
        grid-column: 2 / 4;
        grid-row: 1 / 2;
        grid-template-rows: 1fr;
        justify-content: stretch;
        align-items: center;
        gap: 0.5rem;
        padding-inline: 8px;
        position: relative;
      }
      .total {
        text-align: center;
        text-box: trim-both cap alphabetic;
        font-size: var(--font-size-2xl);
        font-size: clamp(var(--font-size-xl), 11cqw, var(--font-size-2xl));
        color: var(--kid-color-favorite);

        &.long {
          font-size: clamp(var(--font-size-lg), 9cqw, var(--font-size-xl));
        }
      }
      .saving-for {
        display: grid;
        grid-column: 1 / 4;
        grid-row: 2 / 3;
        grid-template-columns: 1fr max-content;
        align-items: center;
        gap: 0.5rem;
        padding: 9px;
        color: var(--kid-color-text-on-bg-light);

        meter {
          width: 100%;
          &::-webkit-meter-bar {
            background-color: color-mix(var(--kid-color-favorite) 15%, transparent);
          }
        }
        .emoji {
          font-size: var(--font-size-lg);
        }
      }
      h1 {
        grid-column: 1 / 3;
        grid-row: 3 / 4;
        align-self: center;
        margin: 0;
        padding-block: 13px;
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-semibold);
        text-box: trim-both cap alphabetic;
        color: var(--kid-color-text-on-favorite);
      }
      .kid-link {
        appearance: none;
        display: block;
        position: absolute;
        inset: 0;
        background: transparent;
        border: none;
        cursor: pointer;
      }
      .actions {
        display: flex;
        grid-column: 3 / 4;
        grid-row: 3 / 4;
        gap: 3px;
        align-self: center;
        position: relative;
      }
    `,
  ]

  /**
   * =========================================================================
   * PROPS
   * =========================================================================
   */
  /**
   * When set to `true`, a button will appear that takes you to the adjustments page for the selected kid.
   */
  @property({ attribute: 'data-enable-link', type: Boolean })
  enableLink = false

  /**
   * The indxe of the kid as stored in the `kids` signal array.
   */
  @property({ attribute: 'data-kid-index' })
  kidIndex = 0

  /**
   * =========================================================================
   * METHODS
   * =========================================================================
   */
  /**
   * When the link is clicked, route the app to the adjustments page and populate the page with the information for the selected kid.
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
      const kidTotalFormatted = formatTotalForCurrency(kidTotalValue, selectedCurrency.get())

      const containerClasses = {
        container: true,
        'child-card': this.enableLink,
        'kid-variables': true,
      }

      const saveForThesholds = {
        low: kid.savingForValue * 0.2,
        high: kid.savingForValue * 0.4,
        optimum: kid.savingForValue * 0.7,
      }
      const savingFor = html`
        <div class="saving-for">
          <meter
            value="${kidTotalValue}"
            min="0"
            low="${saveForThesholds.low}"
            high="${saveForThesholds.high}"
            optimum="${saveForThesholds.optimum}"
            max="${kid.savingForValue}"
          ></meter>
          ${kid.savingFor
            ? html`<span class="${emojiRegex.test(kid.savingFor) ? 'emoji' : ''}">${kid.savingFor}</span>`
            : nothing}
        </div>
      `

      return html`
        <div class="${classMap(containerClasses)}" style="--color-favorite: ${kid.color};">
          <div class="bg" aria-hidden="true"></div>
          <div class="avatar">
            <img src="${kid.photoUrl}" alt="Avatar image for ${kid.name}" width="400" height="400" />
          </div>
          ${savingFor}
          <h1>${kid.name}</h1>
          <div class="info">
            <span class="total ${kidTotalFormatted.length > 10 ? 'long' : ''}">${kidTotalFormatted}</span>
          </div>
          ${this.enableLink ? html`<button class="kid-link" @click="${this._onLinkClick}"></button>` : nothing}
          <div class="actions">
            <currency-selector></currency-selector>
          </div>
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
