import { css, html, LitElement } from 'lit'
import { selectedCurrency } from '@/constants/signals.ts'
import { SignalWatcher } from '@lit-labs/signals'
import { currencyDetails } from '@/constants/currencies.ts'
import { Currency, LocalStorageItems } from 'types'

export class CurrencySelector extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * CSS
   * =========================================================================
   */
  static styles = css`
    .display {
      anchor-name: --display;
      display: inline-block;
      cursor: pointer;
    }
    #settings {
      position-anchor: --display;
      position: fixed;
      position-area: block-end;
      position-try-fallbacks: block-start;
      background-color: var(--color-fpo);
    }
  `

  /**
   * =========================================================================
   * METHODS
   * =========================================================================
   */
  /**
   * TODO
   */
  async onCurrencyInput(e: Event) {
    const currency = (e.target as HTMLSelectElement)?.value as Currency
    selectedCurrency.set(currency)
    localStorage.setItem(LocalStorageItems.SelectedCurrency, currency)
  }

  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  protected render() {
    return html`
      <button class="display" popovertarget="settings">${currencyDetails[selectedCurrency.get()].symbol}</button>
      <div id="settings" popover>
        <form-input>
          <label for="currency">Change Currency</label>
          <select id="currency" @input="${this.onCurrencyInput}">
            ${Object.entries(currencyDetails).map(([key, value]) => {
              return html`<option value="${key}" ?selected="${key === selectedCurrency.get()}">
                <strong>${value.symbol}</strong>${value.title}
              </option>`
            })}
          </select>
        </form-input>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'currency-selector': CurrencySelector
  }
}
