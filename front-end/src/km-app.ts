import { css, html, LitElement, nothing, PropertyValues } from 'lit'
import { classMap } from 'lit/directives/class-map.js'
import { query, state } from 'lit/decorators.js'
import { CurrencyValue, Kid, RouteValue } from '@types'
import { SignalWatcher, watch } from '@lit-labs/signals'
import { UserLoggedInEvent } from '@/pages/km-page-login.ts'
import {
  currentRoute,
  currentUser,
  currentUserIsAdmin,
  currentUserKidId,
  errorDialogMessage,
  kids,
  kidsColors,
  screenshotMode,
  selectedCurrency,
} from '@/signals.ts'
import { log, table } from '@/utils/console.ts'
import { Db } from '@/utils/db.ts'
import { currencyDetails } from '@/constants/currencies.ts'
import { ServerRoute } from '@server/constants/constants.ts'
import { LocalStorageItems } from '@/constants/local-storage.ts'
import { Route } from '@/constants/router.ts'
import Confetti from '@/utils/confetti.ts'
import { getLightDarkColorsFromColor, getThemeColorForColorScheme } from '@/utils/color-helper.ts'
import { updateCurrencyConversionRates } from '@/utils/currency.ts'

/**
 * This file serves as the main entry for the Kids Money app. It handles routing between pages using signals.
 * It provides the global layout that includes the main container, the main navigation, and error dialogs.
 * Events from child components bubble up to this file to refresh the list of kids and adjustments used throughout the app.
 */
export class KmApp extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * CSS
   * =========================================================================
   */
  static styles = css`
    :host {
      container-name: layout;
      container-type: inline-size;
      display: block;
    }
    canvas {
      display: block;
      position: fixed;
      inset: 0;
      width: 100dvw;
      height: 100dvh;
    }
    main {
      position: relative;
      padding: clamp(15px, 8vw, 80px) calc(clamp(15px, 4vw, 80px) + env(safe-area-inset-right, 0))
        calc(80px + env(safe-area-inset-bottom, 0)) calc(clamp(15px, 4vw, 80px) + env(safe-area-inset-left, 0));
      box-sizing: border-box;
    }
    nav {
      --nav-button-color: var(--color-text-nav);
      --nav-button-hover-opacity: 0.5;
      --nav-ul-gap: 1rem;
      box-sizing: content-box;
      position: absolute;
      inset-block-start: 0;
      inset-inline-end: 0;
      padding: 7px;

      ul {
        --component-setting-chip-color: var(--color-bg-nav);
        display: flex;
        justify-content: space-around;
        padding: 0;
        margin: 0;
        list-style: none;
        gap: var(--nav-ul-gap);

        li {
          > button,
          setting-chip > [slot='label'] {
            display: flex;
            flex-direction: column;
            font-size: var(--font-size-xs);
            color: var(--nav-button-color);
          }
          > button {
            appearance: none;
            background-color: transparent;
            border: none;
            transition: opacity var(--duration-hover) ease-out;
            cursor: pointer;

            &:hover {
              opacity: var(--nav-button-hover-opacity);
            }
          }
          setting-chip {
            p {
              margin-block-start: 0;
              font-size: var(--font-size-sm);
            }
            button {
              height: 30px;
            }
          }
        }
      }

      @container (width < 600px) {
        & {
          --nav-button-color: var(--color-text-nav-on-bar);
          --nav-button-hover-opacity: 1;
          --nav-ul-gap: 0;
          position: fixed;
          padding: 7px 20px env(safe-area-inset-bottom, 20px);
          inset: 0;
          inset-block-start: auto;
          inset-block-end: 0;
          background-color: color-mix(var(--color-bg-nav) 70%, transparent);
          border-block-start: 1px solid var(--color-bg-nav);
          box-shadow: var(--box-shadow-card);
          backdrop-filter: blur(20px);
        }
      }
    }
  `

  /**
   * =========================================================================
   * REFS
   * =========================================================================
   */
  /**
   * The canvas element that the confetti effect is installed on.
   */
  @query('#confetti')
  _confettiCanvas!: HTMLCanvasElement

  /**
   * =========================================================================
   * STATE
   * =========================================================================
   */
  /**
   * The instance of the Confetti class. The animation can be triggered using a method on this class.
   */
  @state()
  private _confetti: Confetti | undefined = undefined

  /**
   * The list of kids, settings, and adjustments.
   */
  @state()
  private _kids: Kid[] = []

  /**
   * The kid that matches the logged-in user.
   */
  @state()
  private _loggedInKid: Kid | undefined = undefined

  /**
   * =========================================================================
   * METHODS
   * =========================================================================
   */
  /**
   * Fetches kids data from the API and updates the state.
   */
  private async _fetchKidsData() {
    log('Getting kids from API')
    const kidsData: Kid[] = await Db.postRequest(ServerRoute.GetKids, {
      includeAdjustments: true,
      screenshotMode: screenshotMode.get(),
    })
    this._kids = kidsData.map((kid) => {
      const kidFormatted: Kid = {
        adjustments: kid.adjustments ?? [],
        color: kid.color,
        currentTotal: kid.adjustments?.[0]?.totalToDate ?? 0,
        id: kid.id,
        interest: kid.interest,
        interestThresholds: kid.interestThresholds ? kid.interestThresholds : undefined,
        name: kid.name,
        photoUrl: kid.photoUrl ? kid.photoUrl : undefined,
        savingFor: kid.savingFor ? kid.savingFor : undefined,
        savingForValue: kid.savingForValue,
        themeColors: getLightDarkColorsFromColor(kid.color),
      }

      return kidFormatted
    })
    log('Kids:')
    table(this._kids)

    // Add colors for each kid to state
    const kidsColorsData = this._kids.map((kid) => {
      return getThemeColorForColorScheme(kid.themeColors)
    })
    kidsColors.set(JSON.stringify(kidsColorsData))

    // If user is associated with a kid, get the ID of the kid
    if (currentUserKidId.get()) {
      this._loggedInKid = this._kids.filter((kid) => {
        currentUserKidId.get() === kid.id
      })?.[0]
    }

    // Play animation
    this._updateCurrentTotals()

    // Save kids as a JSON string to share with other components
    kids.set(JSON.stringify(this._kids))
  }

  /**
   * When on the homepage, this method loads the app. On other pages, this method updates the kid and adjustments data.
   */
  private async _onRefreshClicked() {
    if (currentRoute.get() === Route.Home) {
      location.reload()
    } else {
      this._fetchKidsData()
    }
  }

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
    if (e.kidId) {
      currentUserKidId.set(e.kidId)
    }

    this._fetchKidsData()

    const searchParams = new URLSearchParams(window.location.search)
    if (import.meta.env.DEV && searchParams.has('redirect')) {
      const redirect = searchParams.get('redirect') as RouteValue
      log('Redirecting logged in user to page', redirect)
      currentRoute.set(redirect)
    } else {
      log('Redirecting logged in user to home page.')
      currentRoute.set(Route.Home)
    }
  }

  /**
   * Changes route to the login page when a user is logged out.
   */
  private async _onUserLoggedOut() {
    log('Redirecting to login page.')
    currentRoute.set(Route.Login)
  }

  /**
   * Stores the current totals for each kid in local storage. It compares the new totals to previous values and if one value is higher than the previous value, it triggers the confetti animation.
   */
  private async _updateCurrentTotals() {
    if (this._confetti) {
      let playAnimation = false
      const newTotals: number[] = []
      const currentTotalsData = localStorage.getItem(LocalStorageItems.CurrentTotals)
      const currentTotals = JSON.parse(currentTotalsData || '[]')

      if (this._kids?.length) {
        this._kids.forEach((kid, index) => {
          if (kid.currentTotal > currentTotals[index]) {
            playAnimation = true
          }
          newTotals[index] = kid.currentTotal
        })
      }

      if (playAnimation) {
        log('Playing confetti animation')
        this._confetti.shootConfetti()
      } else {
        log('Not going to play confetti animation')
      }

      // Store new totals
      localStorage.setItem(LocalStorageItems.CurrentTotals, JSON.stringify(newTotals))
    }
  }

  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  async connectedCallback() {
    super.connectedCallback()

    // Check to see if the server can be connected to. If not, an error will appear in the console.
    const ping = await Db.getJson(ServerRoute.Ping)
    log('ping', ping)

    // Retrieve information saved in local storage and update global state.
    if (localStorage.getItem(LocalStorageItems.ScreenshotMode) === 'true') {
      screenshotMode.set(true)
    }

    // Get the previously selected currency from the browser.
    const selectedCurrencyKey = localStorage.getItem(LocalStorageItems.SelectedCurrency) as CurrencyValue
    if (selectedCurrencyKey && Object.keys(currencyDetails).includes(selectedCurrencyKey)) {
      selectedCurrency.set(selectedCurrencyKey)
    }

    // Update exchange rates from third-party API.
    await updateCurrencyConversionRates()

    // Add event listener to update kid data when browser changes between light and dark modes.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      log('Refreshing data due to color scheme change')
      this._fetchKidsData()
    })
  }
  protected render() {
    const _route = currentRoute.get()

    const containerClasses = {
      container: true,
      [`layout-route-${_route}`]: true,
    }

    let pageContent = html`<p>Uh Oh.....</p>`

    if (_route === Route.Adjustments) {
      pageContent = html`<km-page-adjustments
        @adjustment-created="${this._fetchKidsData}"
        @kid-updated="${this._fetchKidsData}"
      ></km-page-adjustments>`
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

    const showMainMenu = ([Route.Adjustments, Route.Home, Route.Settings] as RouteValue[]).includes(currentRoute.get())
    const mainMenuContent = showMainMenu
      ? html`
          <nav>
            <ul>
              ${this._loggedInKid
                ? html`<li>
                    <img
                      src="${this._loggedInKid.photoUrl}"
                      alt="Avatar image for ${this._loggedInKid.name}"
                      width="400px"
                      height="400px"
                    />
                  </li>`
                : nothing}
              <li>
                <button @click="${() => currentRoute.set(Route.Home)}">
                  <svg-icon name="logo"></svg-icon> <span>Home</span>
                </button>
              </li>
              <li>
                <button @click="${this._onRefreshClicked}">
                  <svg-icon name="refresh"></svg-icon> <span>Refresh</span>
                </button>
              </li>
              ${currentUserIsAdmin.get() === true
                ? html`<li>
                    <button @click="${() => currentRoute.set(Route.Settings)}">
                      <svg-icon name="settings"></svg-icon>
                      <span>Settings</span>
                    </button>
                  </li>`
                : nothing}
              <li>
                <setting-chip data-unstyled>
                  <span slot="label"><svg-icon name="log-out"></svg-icon> <span>Log out</span></span>
                  <p>Are you sure?</p>
                  <button @click="${() => currentRoute.set(Route.Logout)}">Yes, log out</button>
                </setting-chip>
              </li>
            </ul>
          </nav>
        `
      : nothing

    const hasDialogError = errorDialogMessage.get().length > 0

    return html`
      <canvas id="confetti"></canvas>
      <main data-testid="layout" class="${classMap(containerClasses)}">${pageContent}</main>
      ${mainMenuContent}
      <dialog ?open="${hasDialogError}">${watch(errorDialogMessage)}</dialog>
    `
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties)

    // Set up confetti animation before the first time it is meant to be called.
    this._confetti = new Confetti(this._confettiCanvas)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'km-app': KmApp
  }
}
