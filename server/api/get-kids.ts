import { PrismaClient } from '@prisma/client'
import { log } from '~/utils/console'

export default defineEventHandler(() => {
  log('API: get-kids')
  const runtimeConfig = useRuntimeConfig()

  // If option is set, use mock data
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

  // Get user from database
  const prisma = new PrismaClient()

  async function runQuery () {
    const kids = await prisma.kid.findMany()
    if (kids.length) {
      return kids
    }
    return []
  }

  const response = runQuery()
    .then(async (response) => {
      await prisma.$disconnect()
      log('kdiss ahere', response)
      return response
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })

  log('responsse', response)

  return response
})
