export default defineNuxtRouteMiddleware((to) => {
  const { currentUser } = useCurrentUser()

  // Redirect logged-in users to the index page
  if (currentUser.loggedIn && to.name === 'login') {
    log('Redirecting logged-in user to index page')
    return navigateTo('/')
  }

  // Redirect non-logged-in users to login page
  if (!currentUser.loggedIn && to.name !== 'login') {
    log('Redirecting non-logged-in user to login page')
    return navigateTo('/login')
  }

  // Redirect non-admin users to index page
  if (!currentUser.canViewAdmin && to.name === 'admin') {
    log('Redirecting non-admin to index page')
    return navigateTo('/')
  }
})
