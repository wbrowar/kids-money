import { html, LitElement } from 'lit'
import { selectedCurrency } from '@/constants/signals.ts'
import { SignalWatcher } from '@lit-labs/signals'
import { Currency, currencyDetails } from '@/constants/currencies.ts'
import { LocalStorageItems } from '@/constants/local-storage.ts'

export class CurrencySelector extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * METHODS
   * =========================================================================
   */
  /**
   * TODO
   */
  private async _onCurrencyInput(e: Event) {
    const currency = (e.target as HTMLSelectElement)?.value as keyof typeof Currency
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
          <select id="currency" @input="${this._onCurrencyInput}">
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
