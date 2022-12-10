export default defineNuxtRouteMiddleware((to) => {
  const { currentUser } = useCurrentUser()

  if (!currentUser.loggedIn) {
    log('they not logged')
  }

  // Redirect logged-in users to the index page
  if (currentUser.loggedIn && to.name === 'login') {
    return navigateTo('/')
  }

  // Redirect non-logged-in users to login page
  if (!currentUser.loggedIn && to.name !== 'login') {
    return navigateTo('/login')
  }

  // Redirect non-admin users to homepage
  if (!currentUser.canViewAdmin && to.name === 'admin') {
    return navigateTo('/')
  }
})
