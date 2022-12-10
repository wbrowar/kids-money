import { User } from '~/types'
import { log } from '~/utils/console'

export default defineEventHandler((): User => {
  log('API: get-user')
  const runtimeConfig = useRuntimeConfig()

  if (runtimeConfig.public.useMockApiData) {
    return {
      grownUp: true,
      id: 0,
      username: 'frank'
    }
  }

  // TODO replace with real value
  return {
    grownUp: true,
    id: 0,
    username: 'frank'
  }
})
