import { html, LitElement } from 'lit'
import { selectedCurrency } from '@/constants/signals.ts'
import { SignalWatcher } from '@lit-labs/signals'
import { currencyDetails } from '@/constants/currencies.ts'
import { Currency, LocalStorageItems } from '@types'

export class CurrencySelector extends SignalWatcher(LitElement) {
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
      <setting-chip>
        <span slot="label">${selectedCurrency.get()}</span>

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
      </setting-chip>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'currency-selector': CurrencySelector
  }
}
