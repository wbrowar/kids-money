import { signal } from '@lit-labs/signals'
import { Currency } from '@/constants/currencies.ts'
import { Route } from '@/constants/router.ts'

export const currentRoute = signal(Route.Login)
export const currentUser = signal('')
export const currentUserIsAdmin = signal(false)
export const currentUserKidId = signal(-1)
export const errorDialogMessage = signal('')
export const kids = signal('')
export const kidsColors = signal('[]')
export const screenshotMode = signal(false)
export const selectedCurrency = signal(Currency.UnitedStatesDollar)
export const selectedKidIndex = signal(-1)
