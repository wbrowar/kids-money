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
    const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1))

    const kid = await prisma.kid.findUnique({
      include: {
        adjustments: {
          orderBy: {
            id: 'desc'
          },
          where: {
            createdDate: {
              gte: new Date(oneYearAgo)
            }
          }
        }
      },
      where: {
        slug: body.slug
      }
    })
    if (kid) {
      if (body?.screenshotMode) {
        kid.name = 'Kid Name'
        kid.photoUrl = 'http://placekitten.com/g/200/300'
        return kid
      }

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
      throw e
      // process.exit(1)
    })

  return response
})
