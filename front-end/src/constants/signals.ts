import { signal } from '@lit-labs/signals'
import { Currency, Route } from 'types'

export const currentRoute = signal(Route.Login)
export const currentUser = signal('')
export const currentUserIsAdmin = signal(false)
export const errorDialogMessage = signal('')
export const kids = signal('')
export const screenshotMode = signal(false)
export const selectedCurrency = signal(Currency.UnitedStatesDollar)
export const selectedKidSlug = signal('')
