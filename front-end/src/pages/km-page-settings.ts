import { html, LitElement } from 'lit'
import { SignalWatcher } from '@lit-labs/signals'
import { screenshotMode } from '@/constants/signals.ts'
import { LocalStorageItems } from 'types'
import { log } from '@/utils/console.ts'

export class KmPageSettings extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * METHODS
   * =========================================================================
   */
  /**
   * TODO
   */
  private async _onScreenshotModeInput(e: Event) {
    const checked = (e.target as HTMLInputElement)?.checked
    log('Set screenshot mode', checked)
    screenshotMode.set(checked)
    localStorage.setItem(LocalStorageItems.ScreenshotMode, checked ? 'true' : 'false')
    this.dispatchEvent(new ScreenshotModeInputEvent())
  }

  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  protected render() {
    return html`
      <form-input>
        <label for="screenshot-mode">Enable Screenshot Mode</label>
        <input
          id="screenshot-mode"
          type="checkbox"
          switch
          ?checked="${screenshotMode.get()}"
          @input="${this._onScreenshotModeInput}"
        />
      </form-input>
    `
  }
  protected createRenderRoot() {
    return this
  }
}

/**
 * Event fired when a user is successfully logged out.
 */
export class ScreenshotModeInputEvent extends Event {
  static readonly eventName = 'screenshot-mode-input'

  constructor() {
    super(ScreenshotModeInputEvent.eventName, { bubbles: true, composed: true })
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'km-page-settings': KmPageSettings
  }
}
