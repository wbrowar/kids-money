import { html, LitElement, nothing } from 'lit'
import { classMap } from 'lit/directives/class-map.js'
import { Route } from 'types'
import { SignalWatcher, watch } from '@lit-labs/signals'
import { UserLoggedInEvent } from '@/pages/km-page-login.ts'
import { currentRoute, currentUser, currentUserIsAdmin, errorDialogMessage } from '@/utils/signals.ts'
import { log } from '@/utils/console.ts'

export class KmLayout extends SignalWatcher(LitElement) {
  /**
   * =========================================================================
   * METHODS
   * =========================================================================
   */
  /**
   * Changes route and user settings when a user is logged in.
   */
  async onUserLoggedIn(e: UserLoggedInEvent) {
    currentUser.set(e.username)

    if (e.isGrownUp) {
      currentUserIsAdmin.set(true)
    }

    log('Redirecting logged in user to home page.')
    currentRoute.set(Route.Home)
  }

  /**
   * Changes route and user settings when a user is logged out.
   */
  async onUserLoggedOut() {
    log('Redirecting to login page.')
    currentRoute.set(Route.Login)
  }

  /**
   * =========================================================================
   * LIFECYCLE
   * =========================================================================
   */
  protected render() {
    const _route = currentRoute.get()

    const containerClasses = {
      'layout-content': true,
      [`layout-route-${_route}`]: true,
    }

    let pageContent = html`Uh Oh.....`

    log('Rendering layout with route', _route, _route === Route.Home, Route.Home)
    if (_route === Route.Home) {
      pageContent = html`<km-page-home></km-page-home>`
    } else if (_route === Route.Login) {
      pageContent = html`<km-page-login @logged-in="${this.onUserLoggedIn}"></km-page-login>`
    } else if (_route === Route.Logout) {
      pageContent = html`<km-page-logout @logged-out="${this.onUserLoggedOut}"></km-page-logout>`
    }

    const showMainMenu = [Route.Adjustments, Route.Admin, Route.Home, Route.Settings].includes(currentRoute.get())
    const mainMenuContent = showMainMenu
      ? html`
          <nav>
            <ul>
              ${currentRoute.get() !== Route.Home
                ? html`<li><button @click="${() => currentRoute.set(Route.Home)}">Home</button></li>`
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
  protected createRenderRoot() {
    return this
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'km-layout': KmLayout
  }
}