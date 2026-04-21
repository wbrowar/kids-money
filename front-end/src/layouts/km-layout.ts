import { css, html, LitElement, nothing } from 'lit'
import { classMap } from 'lit/directives/class-map.js'
import { state } from 'lit/decorators.js'
import { Currency, Kid, LocalStorageItems, Route, ServerRoute } from 'types'
import { SignalWatcher, watch } from '@lit-labs/signals'
import { UserLoggedInEvent } from '@/pages/km-page-login.ts'
import {
  currentRoute,
  currentUser,
  currentUserIsAdmin,
  errorDialogMessage,
  kids,
  screenshotMode,
  selectedCurrency,
} from '@/constants/signals.ts'
import { log, table } from '@/utils/console.ts'
import { Db } from '@/utils/db.ts'
import { currencyDetails } from '@/constants/currencies.ts'

export class KmLayout extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * CSS
   * =========================================================================
   */
  static styles = css`
    main {
      height: 100dvh;
      height: stretch;
    }
    nav {
      position: fixed;
      inset-block-start: 0;
      inset-inline-end: 0;
    }
  `

  /**
   * =========================================================================
   * STATE
   * =========================================================================
   */
  /**
   * The list of kids and basic information based on their settings.
   */
  @state()
  private _kids: Kid[] = []

  /**
   * =========================================================================
   * METHODS
   * =========================================================================
   */
  /**
   * Changes route and user settings when a user is logged in.
   *
   * If in dev mode, redirects to the page specified in the query string.
   *
   * For example:
   * `?redirect=settings`
   */
  private async _onUserLoggedIn(e: UserLoggedInEvent) {
    currentUser.set(e.username)

    if (e.isGrownUp) {
      currentUserIsAdmin.set(true)
    }

    this._fetchKidsData()

    const searchParams = new URLSearchParams(window.location.search)
    if (import.meta.env.DEV && searchParams.has('redirect')) {
      const redirect = searchParams.get('redirect') as Route
      log('Redirecting logged in user to page', redirect)
      currentRoute.set(redirect)
    } else {
      log('Redirecting logged in user to home page.')
      currentRoute.set(Route.Home)
    }
  }

  /**
   * Changes route and user settings when a user is logged out.
   */
  private async _onUserLoggedOut() {
    log('Redirecting to login page.')
    currentRoute.set(Route.Login)
  }

  /**
   * Changes route and user settings when a user is logged out.
   */
  private async _fetchKidsData() {
    log('Getting kids from API')
    const kidsData = await Db.postRequest(ServerRoute.GetKids, {
      includeAdjustments: true,
      screenshotMode: screenshotMode.get(),
    })
    this._kids = kidsData.map((kid: Kid) => {
      const kidFormatted: Kid = {
        adjustments: kid.adjustments ?? [],
        color: kid.color,
        id: kid.id,
        interest: kid.interest,
        interestThresholds: kid.interestThresholds ? kid.interestThresholds : undefined,
        name: kid.name,
        photoUrl: kid.photoUrl ? kid.photoUrl : undefined,
        savingFor: kid.savingFor ? kid.savingFor : undefined,
        savingForValue: kid.savingForValue,
      }

      return kidFormatted
    })
    log('Kids:')
    table(this._kids)

    kids.set(JSON.stringify(this._kids))
  }

  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  connectedCallback() {
    super.connectedCallback()

    /**
     * Retrieve information saved in local storage and update global state.
     */
    if (localStorage.getItem(LocalStorageItems.ScreenshotMode) === 'true') {
      screenshotMode.set(true)
    }
    console.log('screenshotMode', screenshotMode.get())

    const selectedCurrencyKey = localStorage.getItem(LocalStorageItems.SelectedCurrency) as Currency
    if (selectedCurrencyKey && Object.keys(currencyDetails).includes(selectedCurrencyKey)) {
      selectedCurrency.set(selectedCurrencyKey)
    }
    console.log('selectedCurrency', selectedCurrency.get())
  }
  protected render() {
    const _route = currentRoute.get()

    const containerClasses = {
      'layout-content': true,
      [`layout-route-${_route}`]: true,
    }

    let pageContent = html`<p>Uh Oh.....</p>`

    if (_route === Route.Adjustments) {
      pageContent = html`<km-page-adjustments @adjustment-created="${this._fetchKidsData}"></km-page-adjustments>`
    } else if (_route === Route.Home) {
      pageContent = html`<km-page-home></km-page-home>`
    } else if (_route === Route.Login) {
      pageContent = html`<km-page-login @logged-in="${this._onUserLoggedIn}"></km-page-login>`
    } else if (_route === Route.Logout) {
      pageContent = html`<km-page-logout @logged-out="${this._onUserLoggedOut}"></km-page-logout>`
    } else if (_route === Route.Settings) {
      pageContent = html`<km-page-settings
        @kid-updated="${this._fetchKidsData}"
        @screenshot-mode-input="${this._fetchKidsData}"
      ></km-page-settings>`
    }

    const showMainMenu = [Route.Adjustments, Route.Home, Route.Settings].includes(currentRoute.get())
    const mainMenuContent = showMainMenu
      ? html`
          <nav>
            <ul>
              ${currentRoute.get() !== Route.Home
                ? html`<li><button @click="${() => currentRoute.set(Route.Home)}">Home</button></li>`
                : nothing}
              <li><button @click="${this._fetchKidsData}">Refresh</button></li>
              ${currentUserIsAdmin.get() === true
                ? html`<li><button @click="${() => currentRoute.set(Route.Settings)}">Settings</button></li>`
                : nothing}
              <li><button @click="${() => currentRoute.set(Route.Logout)}">Logout</button></li>
            </ul>
          </nav>
        `
      : nothing

    const hasDialogError = errorDialogMessage.get().length > 0

    return html`
      <main data-testid="layout" class="${classMap(containerClasses)}">${pageContent}</main>
      ${mainMenuContent}
      <dialog ?open="${hasDialogError}">${watch(errorDialogMessage)}</dialog>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'km-layout': KmLayout
  }
}
