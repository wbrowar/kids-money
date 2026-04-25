/**
 * A list of server endpoints used through the application.
 */
export const ServerRoute: Record<string, string> = {
  /* Create a new adjustment. */
  CreateAdjustment: '/create-adjustment',
  /* Create a new kid or update an existing one. */
  CreateUpdateKid: '/create-update-kid',
  /* Gets kid settings and all adjustments made in the past calendar year. */
  GetKids: '/get-kids',
  /* Gets all usernames and grownUp status of all users. */
  GetUsers: '/get-users',
  /* Uses a username and password to log the user in. */
  Login: '/login',
  /* TODO */
  RemoveKid: '/remove-kid',
  /* TODO */
  UpdateUser: '/update-user',
}
