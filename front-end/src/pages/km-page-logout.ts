import { html, LitElement } from 'lit'
import { log } from '@/utils/console.ts'
import { SignalWatcher } from '@lit-labs/signals'
import { LocalStorageItems } from '@/constants/local-storage.ts'

/**
 * This page is used to log the current user out of the system. This page should not be visible to users unless a problem occurs during logout.
 */
export class KmPageLogout extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  connectedCallback() {
    super.connectedCallback()

    log('Removing user data stored in local storage')
    localStorage.removeItem(LocalStorageItems.CurrentUser)
    localStorage.removeItem(LocalStorageItems.SelectedCurrency)

    customElements.whenDefined('km-app').then(() => {
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
