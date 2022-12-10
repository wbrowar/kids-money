import { User } from '~/types'
import { log } from '~/utils/console'

export default defineEventHandler((): User => {
  log('API: get-users')
  return {
    grownUp: true,
    id: 0,
    username: 'frank'
  }
})
