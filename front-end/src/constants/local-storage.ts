/**
 * Keys for items stored in local storage.
 */
export const LocalStorageItems: Record<string, string> = {
  /* Stores an array of the totals for all kids. The index of the array should match up to the index for the kid. */
  CurrentTotals: 'current-totals',
  /* Stores the username and grownUp status of the logged-in user. */
  CurrentUser: 'current-user',
  /* Stores the latest value of the screenshot mode setting. */
  ScreenshotMode: 'screenshot-mode',
  /* Stores the key of the selected currency. */
  SelectedCurrency: 'selected-currency',
}
