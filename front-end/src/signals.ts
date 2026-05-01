import { signal } from '@lit-labs/signals'
import { Currency } from '@/constants/currencies.ts'
import { Route } from '@/constants/router.ts'

/* The current page the user is on. */
export const currentRoute = signal(Route.Login)
/* The username of the currently logged-in user. */
export const currentUser = signal('')
/* Set to `true` when the user has admin privileges. */
export const currentUserIsAdmin = signal(false)
/* If the current user is linked to a kid, this will store the ID of the kid row in the database. */
export const currentUserKidId = signal(-1)
/* If an error occurs, this message will be displayed in the error dialog. */
export const errorDialogMessage = signal('')
/* A JSON string containing the kids data as returned by the API. */
export const kids = signal('')
/* An array of JavaScript-computed colors. The index of the array matches the index of each kid in the `kids` signal. */
export const kidsColors = signal('[]')
/* When set to `true`, the app will remove the names and photos of kids, and the names of users, and replace them with dummy data. */
export const screenshotMode = signal(false)
/* The currency selected by the user. This converts money values and displays them in the selected currency. */
export const selectedCurrency = signal(Currency.UnitedStatesDollar)
/* Stores the index for the selected kid when routing to the adjustments page. */
export const selectedKidIndex = signal(-1)
