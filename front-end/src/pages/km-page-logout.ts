import { css, html, LitElement } from 'lit'
import { LocalStorageItems } from '@types'
import { log } from '@/utils/console.ts'
import { SignalWatcher } from '@lit-labs/signals'

export class KmPageLogout extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * CSS
   * =========================================================================
   */
  static styles = css``

  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  connectedCallback() {
    super.connectedCallback()

    log('Removing user data stored in local storage')
    localStorage.removeItem(LocalStorageItems.CurrentUser)

    customElements.whenDefined('km-layout').then(() => {
      this.dispatchEvent(new UserLoggedOutEvent())
    })
  }
  protected render() {
    return html`<p>Logging out...</p>`
  }
}

/**
 * Event fired when a user is successfully logged out.
 */
export class UserLoggedOutEvent extends Event {
  static readonly eventName = 'logged-out'

  constructor() {
    super(UserLoggedOutEvent.eventName, { bubbles: true, composed: true })
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'km-page-logout': KmPageLogout
  }
}
