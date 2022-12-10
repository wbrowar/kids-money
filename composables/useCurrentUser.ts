import { User } from '~/types'

export const useCurrentUser = () => {
  const runtimeConfig = useRuntimeConfig()

  const isGrownUp = useState('currentUserGrownUp', () => false)
  const loggedIn = useState('currentUserLoggedIn', () => false)
  const username = useState('currentUserUsername', () => '')

  // If already logged in, restore session
  if (process.client) {
    const sessionData = sessionStorage.getItem('logged-in')
    if (sessionData) {
      const sessionDataParsed = JSON.parse(sessionData)
      log('they logged')
      isGrownUp.value = sessionDataParsed.isGrownUp
      loggedIn.value = true
      username.value = sessionDataParsed.username
    }
  }

  const canViewAdmin = computed(() => {
    return isGrownUp.value && runtimeConfig.public.enableAdminRoute
  })

  const currentUser = reactive({
    canViewAdmin: canViewAdmin.value,
    grownUp: isGrownUp.value,
    loggedIn: loggedIn.value,
    username: username.value
  })

  async function logIn ({ username: usernameArg }: { username: string }) {
    try {
      const { data } = await useFetch<User>('/api/get-user', {
        body: {
          username: usernameArg
        },
        method: 'post',
        pick: ['grownUp', 'id', 'username']
      })

      if (data.value && (data.value.username ?? false)) {
        isGrownUp.value = data.value.grownUp ?? false
        loggedIn.value = true
        username.value = data.value.username
        sessionStorage.setItem('logged-in', JSON.stringify({
          isGrownUp: isGrownUp.value,
          username: username.value
        }))
        log('Logged in user:', currentUser)
        navigateTo('/')
      } else {
        showError({ statusCode: 500, statusMessage: 'Page Not Found' })
      }
    } catch (e) {
      showError({ statusCode: 500, statusMessage: 'Page Not Found' })
    }
  }

  function logOut () {
    sessionStorage.removeItem('logged-in')
    isGrownUp.value = false
    currentUser.loggedIn = false
    currentUser.username = ''
    log('Logged out user:', currentUser)
    navigateTo('/login')
  }

  return {
    currentUser,
    logIn,
    logOut
  }
}
