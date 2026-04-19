import { KmLayout } from '@/layouts/km-layout.ts'
import { KmPageLogin } from '@/pages/km-page-login.ts'
import { KmPageHome } from '@/pages/km-page-home.ts'
import { KmPageLogout } from '@/pages/km-page-logout.ts'
import { KidTotalCard } from '@/components/kid-total-card.ts'
import { CurrencySelector } from '@/components/currency-selector.ts'
import { FormInput } from '@/components/form-input.ts'
import { KmPageSettings } from '@/pages/km-page-settings.ts'
import { KmPageAdjustments } from '@/pages/km-page-adjustments.ts'

export const customElementNames = [
  'currency-selector',
  'form-input',
  'kid-total-card',
  'km-layout',
  'km-page-adjustments',
  'km-page-home',
  'km-page-login',
  'km-page-logout',
  'km-page-settings',
] as const

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
        case 'currency-selector':
          customElements.define(element, CurrencySelector)
          break
        case 'form-input':
          customElements.define(element, FormInput)
          break
        case 'kid-total-card':
          customElements.define(element, KidTotalCard)
          break
        case 'km-layout':
          customElements.define(element, KmLayout)
          break
        case 'km-page-adjustments':
          customElements.define(element, KmPageAdjustments)
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
        case 'km-page-settings':
          customElements.define(element, KmPageSettings)
          break
      }

      definedElements.push(element)
    }
  })

  return definedElements
}
