import { css, html, HTMLTemplateResult, LitElement, nothing } from 'lit'
import { SignalWatcher } from '@lit-labs/signals'
import { currentRoute, currentUserIsAdmin, kids, screenshotMode } from '@/constants/signals.ts'
import { Kid, User, UserDto } from '@types'
import { log, table } from '@/utils/console.ts'
import { state } from 'lit/decorators.js'
import { Db } from '@/utils/db.ts'
import { ServerRoute } from '@server/constants/constants.ts'
import { LocalStorageItems } from '@/constants/local-storage.ts'
import { Route } from '@/constants/router.ts'

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
   * TODO
   */
  @state()
  private _isSaving = false

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
  private async _getUsers() {
    log('Getting users from API')
    this._users = await Db.postRequest(ServerRoute.GetUsers, {})
    log('Users:')
    table(this._users)
  }

  /**
   * TODO
   */
  private async _onUserKidIdInput(e: InputEvent, username: string) {
    const inputValue = (e.target as HTMLSelectElement)?.value
    log('Linking user to kid', inputValue, username)
    if (!this._isSaving) {
      this._isSaving = true

      const saved = await Db.postRequest(ServerRoute.UpdateUser, {
        kidId: inputValue === '__none__' ? null : parseInt(inputValue),
        username,
      } as UserDto)
      if (saved.success) {
        log('User updated')
        this._getUsers()
      }
      this._isSaving = false
    }
  }
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

    if (!currentUserIsAdmin.get()) {
      currentRoute.set(Route.Home)
    }
    this._getUsers()
  }
  protected render() {
    const kidsJson = kids.get()
    let kidLookup: Record<number, Kid> = {}

    const kidsEditors: HTMLTemplateResult[] = []
    if (kidsJson) {
      const kidsData: Kid[] = JSON.parse(kidsJson)

      kidsData.forEach((kid, index) => {
        kidsEditors.push(html`<kid-editor data-kid-index="${index}"></kid-editor>`)
        kidLookup[kid.id] = kid
      })
    }

    return html`
      <h1>Settings</h1>
      <h2>Kids</h2>
      ${kidsEditors ? html`<div class="kids">${kidsEditors}</div>` : nothing}

      <h2>Users</h2>
      <div class="users">
        ${this._users.map((user, index) => {
          const relatedKid = user.kidId ? kidLookup[user.kidId] : undefined
          return html`
            <div style="--component-setting-chip-color: ${relatedKid ? relatedKid.color : 'currentColor'}">
              <h3>${screenshotMode.get() ? `user${index}` : user.username}</h3>
              <setting-chip>
                <span slot="label">${user.grownUp ? 'Admin' : relatedKid ? relatedKid.name : `Non-Admin`}</span>
                ${user.grownUp
                  ? html`<p>As an admin, this user can add adjustments and set settings for all kids.</p>`
                  : html` <label for="currency">Link user to kid</label>
                      <select id="currency" @input="${(e: InputEvent) => this._onUserKidIdInput(e, user.username)}">
                        <option value="__none__">${relatedKid ? 'Unlink kid' : 'Select a kid'}</option>
                        ${Object.entries(kidLookup).map(([key, value]) => {
                          return html`<option value="${key}" ?selected="${key === user.kidId?.toString()}">
                            ${value.name}
                          </option>`
                        })}
                      </select>`}
              </setting-chip>
            </div>
          `
        })}
      </div>

        <h2>Misc</h2>
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
