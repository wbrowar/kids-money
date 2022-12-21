/*
 * Computed helpers based on logged-in user and their Admin status.
 */
export const useCurrentUser = () => {
  const { cookieExpirationDate } = useStringFormatter()

  const loggedInCookie = useCookie<Record<string, any>>('logged-in', {
    maxAge: cookieExpirationDate()
  })
  const runtimeConfig = useRuntimeConfig()

  const canViewAdmin = computed(() => {
    return grownUp.value && runtimeConfig.public.enableAdminRoute
  })
  const grownUp = useState('currentUserGrownUp', () => false)
  const loggedIn = useState('currentUserLoggedIn', () => false)
  const username = useState('currentUserUsername', () => '')

  // If already logged in, restore session
  if (loggedInCookie.value) {
    if (loggedInCookie.value?.username) {
      grownUp.value = loggedInCookie.value.grownUp
      loggedIn.value = true
      username.value = loggedInCookie.value.username
    }
  }

  return {
    canViewAdmin,
    grownUp,
    loggedIn,
    loggedInCookie,
    username
  }
}
