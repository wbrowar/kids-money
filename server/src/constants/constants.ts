/**
 * A list of server endpoints used through the application.
 */
export const ServerRoute = {
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
  /* Checks to see if the server is running. */
  Ping: '/api/ping',
  /* Removes a kid from the database. */
  RemoveKid: '/api/remove-kid',
  /* Updates a user when a username is passed in. */
  UpdateUser: '/api/update-user',
} as const
