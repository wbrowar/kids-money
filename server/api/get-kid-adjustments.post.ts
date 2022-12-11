import { log } from '~/utils/console'
import prisma from '~/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  log('API: get-kid-adjustments', body)
  const runtimeConfig = useRuntimeConfig()

  // If option is set, use mock data
  if (runtimeConfig.public.useMockApiData) {
    return new Promise(() => {
      return {
        adjustments: [],
        allowance: 0,
        color: '93,0,255',
        id: 1,
        interest: 0,
        name: 'This Is Kid 2',
        photoUrl: undefined,
        savingFor: undefined,
        savingForType: 'text',
        slug: 'kid-2'
      }
    })
  }

  // Get user from database
  async function runQuery () {
    const kid = await prisma.kid.findUnique({
      include: {
        adjustments: true
      },
      where: {
        slug: body.slug
      }
    })
    if (kid ?? false) {
      return kid
    }
    return []
  }

  const response = runQuery()
    .then(async (response) => {
      await prisma.$disconnect()
      return response
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })

  return response
})
