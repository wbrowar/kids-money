/**
 * A list of server endpoints used through the application.
 */
export const ServerRoute: Record<string, string> = {
  /* Create a new adjustment. */
  CreateAdjustment: '/api/create-adjustment',
  /* Create a new kid or update an existing one. */
  CreateUpdateKid: '/api/create-update-kid',
  /* Gets kid settings and all adjustments made in the past calendar year. */
  GetKids: '/api/get-kids',
  /* Gets all usernames and grownUp status of all users. */
  GetUsers: '/api/get-users',
  /* Uses a username and password to log the user in. */
  Login: '/api/login',
  /* TODO */
  Ping: '/api/ping',
  /* TODO */
  RemoveKid: '/api/remove-kid',
  /* TODO */
  UpdateUser: '/api/update-user',
}
