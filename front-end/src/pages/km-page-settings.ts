import { css, html, HTMLTemplateResult, LitElement, nothing } from 'lit'
import { SignalWatcher } from '@lit-labs/signals'
import { currentRoute, currentUserIsAdmin, kids, screenshotMode } from '@/signals.ts'
import { Kid, User, UserDto } from '@types'
import { log, table } from '@/utils/console.ts'
import { state } from 'lit/decorators.js'
import { Db } from '@/utils/db.ts'
import { ServerRoute } from '@server/constants/constants.ts'
import { LocalStorageItems } from '@/constants/local-storage.ts'
import { Route } from '@/constants/router.ts'

/**
 * This page is used by users with admin privalages (i.e. users with the grownUp flag set to true) to manage the kids and users.
 *
 * A kid can be added or removed.
 *
 * Settings for each kid can be changed by clicking on the value, changing it, then letting the popover close.
 *
 * Other app-wide settings can be set here. Also, information about external API use is displayed on this page.
 */
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
    dl {
      display: inline-grid;
      grid-template-columns: auto auto;
      gap: 0.2rem 0.5rem;

      dt {
        font-weight: var(--font-weight-semibold);
      }
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
   * Tracks if the app is currently using the API and prevents saving during that time.
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
   * Fetches the users from the database.
   */
  private async _getUsers() {
    log('Getting users from API')
    this._users = await Db.postRequest(ServerRoute.GetUsers, {})
    log('Users:')
    table(this._users)
  }

  /**
   * Updates the specified property for the selected kid upon closing the settings popover.
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
   * Updates the `screenshotMode` signal and stores the value of the `screenshotMode` checkbox into local storage.
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

    const currencyData = localStorage.getItem(LocalStorageItems.ExchangeRates)
      ? JSON.parse(localStorage.getItem(LocalStorageItems.ExchangeRates)!)
      : undefined
    const currencyInfo = currencyData ? [['Last Synced', currencyData.lastUpdated]] : []
    Object.keys(currencyData.rates).forEach((currency) => {
      currencyInfo.push([`${currency} to USD`, currencyData.rates[currency].toUsd])
      currencyInfo.push([`${currency} from USD`, currencyData.rates[currency].fromUsd])
    })

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

      ${currencyInfo.length
        ? html`<h2>Currency Info</h2>
            <dl>
              ${currencyInfo.map(
                ([title, definition]) =>
                  html`<dt>${title}</dt>
                    <dd>${definition}</dd>`
              )}
            </dl>`
        : nothing}
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
