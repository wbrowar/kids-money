/**
 * A list of all routes available in the application.
 */
export const Route = {
  /* Displays all adjustments and related data for selected kid. */
  Adjustments: 'adjustments',
  /* Displays a list of all kids and a dashboard of combined data. */
  Home: 'home',
  /* The login page for the application. */
  Login: 'login',
  /* Logs the user out of the application. */
  Logout: 'logout',
  /* Allows admins to create and remove kids and adjust settings for the application. */
  Settings: 'settings',
} as const
