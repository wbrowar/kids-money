import { Kid } from '~/types'
import { log } from '~/utils/console'

export default defineEventHandler((): Kid[] => {
  log('API: get-kids')
  const runtimeConfig = useRuntimeConfig()

  if (runtimeConfig.public.useMockApiData) {
    return [
      {
        allowance: 5,
        color: '#ff0000',
        id: 0,
        interest: 0.01,
        name: 'Kid 1',
        photoUrl: 'http://placekitten.com/g/200/300',
        savingFor: 'http://placekitten.com/g/400/600',
        slug: 'kid-1'
      },
      {
        allowance: 0,
        color: '93,0,255',
        id: 1,
        interest: 0,
        name: 'This Is Kid 2',
        photoUrl: undefined,
        savingFor: undefined,
        slug: 'kid-2'
      }
    ]
  }

  // TODO replace with real value

  return []
})
