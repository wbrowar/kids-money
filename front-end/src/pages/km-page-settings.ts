import { css, html, LitElement, nothing } from 'lit'
import { SignalWatcher } from '@lit-labs/signals'
import { kids, screenshotMode } from '@/constants/signals.ts'
import { Kid, LocalStorageItems, User } from '@types'
import { log, table } from '@/utils/console.ts'
import { state } from 'lit/decorators.js'
import { Db } from '@/utils/db.ts'
import { ServerRoute } from '@server/constants/constants.ts'

export class KmPageSettings extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * CSS
   * =========================================================================
   */
  static styles = css`
    :host {
      color: var(--color-text-copy);
    }
    :heading {
      color: var(--color-text-header);
    }
    h2 {
      margin-top: 3rem;
    }
    .kids {
      display: flex;
      flex-flow: row wrap;
      justify-items: start;
      gap: 1.5rem;
    }
    .users {
      display: flex;
      flex-flow: row wrap;
      justify-items: start;
      gap: 1.5rem;
    }
  `

  /**
   * =========================================================================
   * STATE
   * =========================================================================
   */
  /**
   * The list of users stored in the database.
   */
  @state()
  private _users: User[] = []

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
  async connectedCallback() {
    super.connectedCallback()

    log('Getting users from API')
    this._users = await Db.postRequest(ServerRoute.GetUsers, {})
    log('Users:')
    table(this._users)
  }
  protected render() {
    const kidsJson = kids.get()

    let kidsEditors
    if (kidsJson) {
      const kidsData: Kid[] = JSON.parse(kidsJson)

      kidsEditors = kidsData.map((_kid, index) => {
        return html`<kid-editor data-kid-index="${index}"></kid-editor>`
      })
    }

    return html`
      <h1>Settings</h1>
      <h2>Kids</h2>
      ${kidsEditors ? html`<div class="kids">${kidsEditors}</div>` : nothing}

      <h2>Users</h2>
      <div class="users">
        ${this._users.map(
          (user) => html`
            <div>
              <h3>${user.username}</h3>
              ${user.grownUp ? html`<span>Admin</span>` : html`<span>Non-Admin</span>`}
            </div>
          `
        )}
      </div>

        <h2>Debugging</h2>
        <form-input>
          <label>
            <input type="checkbox" switch ?checked="${screenshotMode.get()}" @input="${this._onScreenshotModeInput}" />
            Enable Screenshot Mode</label
          >
        </form-input>
      </div>
    `
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
