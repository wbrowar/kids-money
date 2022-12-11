import { User } from '~/types'

export const useCurrentUser = () => {
  const runtimeConfig = useRuntimeConfig()

  const canViewAdmin = computed(() => {
    return grownUp.value && runtimeConfig.public.enableAdminRoute
  })
  const grownUp = useState('currentUserGrownUp', () => false)
  const loggedIn = useState('currentUserLoggedIn', () => false)
  const username = useState('currentUserUsername', () => '')

  // If already logged in, restore session
  if (process.client) {
    const sessionData = sessionStorage.getItem('logged-in')
    if (sessionData) {
      const sessionDataParsed = JSON.parse(sessionData)
      grownUp.value = sessionDataParsed.grownUp
      loggedIn.value = true
      username.value = sessionDataParsed.username
    }
  }

  async function logIn ({
    password: passwordArg,
    redirect,
    username: usernameArg
  }: {
    password: string;
    redirect: string;
    username: string;
  }) {
    try {
      const { data } = await useFetch<User>('/api/get-user', {
        body: {
          password: passwordArg,
          username: usernameArg
        },
        method: 'post',
        pick: ['grownUp', 'id', 'username']
      })

      if (data.value && (data.value.username ?? false)) {
        grownUp.value = data.value.grownUp ?? false
        loggedIn.value = true
        username.value = data.value.username
        sessionStorage.setItem('logged-in', JSON.stringify({
          grownUp: grownUp.value,
          username: username.value
        }))
        log('Logged in user:', username.value)
        if (redirect) {
          navigateTo(redirect)
        }
      } else {
        showError({ statusCode: 500, statusMessage: 'Page Not Found' })
      }
    } catch (e) {
      showError({ statusCode: 500, statusMessage: 'Page Not Found' })
    }
  }

  function logOut () {
    sessionStorage.removeItem('logged-in')
    grownUp.value = false
    loggedIn.value = false
    username.value = ''
    log('Logged out user:', username.value)
    navigateTo('/login')
  }

  return {
    canViewAdmin,
    grownUp,
    loggedIn,
    logIn,
    logOut,
    username
  }
}
