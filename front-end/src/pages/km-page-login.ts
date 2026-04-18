import { html, LitElement } from 'lit'
import { Db } from '@/utils/db.ts'
import { LocalStorageItems, ServerRoute } from 'types'
import { log } from '@/utils/console.ts'
import { SignalWatcher } from '@lit-labs/signals'
import { errorDialogMessage } from '@/utils/signals.ts'

export class KmPageLogin extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * METHODS
   * =========================================================================
   */
  /**
   * Handle form submission.
   */
  async submitForm(e: Event) {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)

    try {
      log('Logging in user', formData.get('username'), formData.get('password'))
      const response = await Db.postRequest(ServerRoute.Login, {
        username: formData.get('username'),
        password: formData.get('password'),
      })

      this.dispatchEvent(new UserLoggedInEvent(response.username, response.grownUp ?? false))

      localStorage.setItem(
        LocalStorageItems.CurrentUser,
        JSON.stringify({ username: response.username, grownUp: response.grownUp ?? false })
      )
    } catch (error) {
      if (error instanceof Error) {
        log('User login failed', error.message)
        errorDialogMessage.set(error.message)
      }
    }
  }

  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  connectedCallback() {
    super.connectedCallback()

    log('Checking if user is logged in and value is saved in local storage')
    const loggedIn = localStorage.getItem(LocalStorageItems.CurrentUser)

    if (loggedIn) {
      log('Logged in user value found in local storage. Parsing user data.')
      const userSettings = JSON.parse(loggedIn)

      if (userSettings?.username) {
        customElements.whenDefined('km-layout').then(() => {
          this.dispatchEvent(new UserLoggedInEvent(userSettings.username, userSettings?.isGrownUp ?? false))
        })
      }
    }
  }
  protected render() {
    return html`<form id="login" @submit="${this.submitForm}">
      <input type="text" name="username" autocomplete="username" placeholder="Username" />
      <input type="password" name="password" autocomplete="current-password" placeholder="Password" />
      <button type="submit">Log in</button>
    </form>`
  }
  protected createRenderRoot() {
    return this
  }
}

/**
 * =========================================================================
 * EVENTS
 * =========================================================================
 */
/**
 * Event fired when a user is successfully logged in.
 *
 * Returns `isGrownUp` to indicate if the user has an admin role.
 *
 * Usage:
 * ```js
 * checkbox.addEventListener(LocalStorageItems.CurrentUser, (e) => {
 *   console.log(e.isGrownUp);
 * });
 * ```
 */
export class UserLoggedInEvent extends Event {
  static readonly eventName = 'logged-in'

  readonly username: string = ''
  readonly isGrownUp: boolean = false

  constructor(username: string, isGrownUp: boolean) {
    super(UserLoggedInEvent.eventName, { bubbles: true, composed: true })

    this.username = username
    this.isGrownUp = isGrownUp
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'km-page-login': KmPageLogin
  }
}