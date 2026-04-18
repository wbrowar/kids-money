import { KmLayout } from '@/layouts/km-layout.ts'
import { KmPageLogin } from '@/pages/km-page-login.ts'
import { KmPageHome } from '@/pages/km-page-home.ts'
import { KmPageLogout } from '@/pages/km-page-logout.ts'

export const customElementNames = ['km-layout', 'km-page-home', 'km-page-login', 'km-page-logout'] as const

/**
 * The names of all custom elements to be registered.
 */
export type KmCustomElements = (typeof customElementNames)[number]

/**
 * Defines the custom elements specified in the list.
 * @param prefix Prepended text before the last `-` and the name of the custom element.
 */
export function defineAllCustomElements() {
  return defineCustomElements([...customElementNames])
}

/**
 * Defines the custom elements specified in the list.
 * @param list A list of custom elements.
 * @param prefix Prepended text before the last `-` and the name of the custom element.
 */
export function defineCustomElements(list: KmCustomElements[]) {
  const definedElements: string[] = []

  /**
   * Define all supporting elements specified in the list.
   */
  list.forEach((element) => {
    if (!customElements.get(element)) {
      switch (element) {
        case 'km-layout':
          customElements.define(element, KmLayout)
          break
        case 'km-page-home':
          customElements.define(element, KmPageHome)
          break
        case 'km-page-login':
          customElements.define(element, KmPageLogin)
          break
        case 'km-page-logout':
          customElements.define(element, KmPageLogout)
          break
      }

      definedElements.push(element)
    }
  })

  return definedElements
}
