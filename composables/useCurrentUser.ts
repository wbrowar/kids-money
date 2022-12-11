import { User } from '~/types'

export const useCurrentUser = () => {
  const loggedInCookie = useCookie<Record<string, any>>('logged-in')
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
        const cookieValue = {
          grownUp: grownUp.value,
          username: username.value
        }
        loggedInCookie.value = cookieValue
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
    loggedInCookie.value = {}
    log('Logging out user:', username.value)
    grownUp.value = false
    loggedIn.value = false
    username.value = ''
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
