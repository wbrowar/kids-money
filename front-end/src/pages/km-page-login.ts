import { css, html, LitElement } from 'lit'
import { Db } from '@/utils/db.ts'
import { log, table } from '@/utils/console.ts'
import { SignalWatcher } from '@lit-labs/signals'
import { errorDialogMessage } from '@/signals.ts'
import { ServerRoute } from '@server/constants/constants.ts'
import { LocalStorageItems } from '@/constants/local-storage.ts'

/**
 * This page includes a login form. Once the user successfully logs in, their username and settings are stored in local storage.
 *
 * If the user information is found in local storage, the last user to login is redirected to the home page.
 *
 * _NOTE: Users are created via the CLI in the `server` directory. No emails or other personal information are stored and an email should not be used as the user name. The username and password are stored as plain text in the database, so they should not contain any sensitive information._
 */
export class KmPageLogin extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * CSS
   * =========================================================================
   */
  static styles = css`
    :host {
      container-name: page;
      container-type: inline-size;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 15px;
    }
    svg-icon {
      --svg-icon-size: 80px;
      color: var(--color-bg-nav);
    }
    form {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: repeat(4, 40px);
      gap: 5px;
      color: var(--color-text-nav);

      input {
        display: block;
        padding-inline: 1rem;
        border: 1px solid var(--color-bg-nav);
        border-radius: var(--border-radius-sm);
      }
      button {
        display: block;
        padding-inline: 1rem;
        background-color: color-mix(var(--color-bg-nav) 70%, transparent);
        border: 1px solid var(--color-bg-nav);
        border-radius: var(--border-radius-sm);
        color: var(--color-text-nav-on-bar);
        cursor: pointer;
      }
    }
  `

  /**
   * =========================================================================
   * METHODS
   * =========================================================================
   */
  /**
   * Handle form submission.
   */
  private async submitForm(e: Event) {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)

    try {
      log('Logging in user', formData.get('username'), formData.get('password'))
      const response = await Db.postRequest(ServerRoute.Login, {
        username: formData.get('username'),
        password: formData.get('password'),
      })

      table(response)

      this.dispatchEvent(new UserLoggedInEvent(response.username, response.grownUp ?? false, response.kidId))

      localStorage.setItem(
        LocalStorageItems.CurrentUser,
        JSON.stringify({ username: response.username, grownUp: response.grownUp ?? false, kidId: response.kidId })
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

      table(userSettings)

      if (userSettings?.username) {
        customElements.whenDefined('km-app').then(() => {
          this.dispatchEvent(
            new UserLoggedInEvent(userSettings.username, userSettings?.grownUp ?? false, userSettings?.kidId)
          )
        })
      }
    }
  }
  protected render() {
    return html`<svg-icon name="logo"></svg-icon>
      <form id="login" action="" @submit="${this.submitForm}">
        <input required type="text" name="username" autocomplete="username" placeholder="Username" />
        <input required type="password" name="password" autocomplete="current-password" placeholder="Password" />
        <button type="submit">Log in</button>
      </form>`
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
 */
export class UserLoggedInEvent extends Event {
  static readonly eventName = 'logged-in'

  readonly username: string = ''
  readonly kidId: number | undefined = undefined
  readonly isGrownUp: boolean = false

  constructor(username: string, isGrownUp: boolean, kidId: number | undefined) {
    super(UserLoggedInEvent.eventName, { bubbles: true, composed: true })

    this.username = username
    this.isGrownUp = isGrownUp
    this.kidId = kidId
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'km-page-login': KmPageLogin
  }
}
