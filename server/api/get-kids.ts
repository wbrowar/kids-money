import { log } from '~/utils/console'
import prisma from '~/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  log('API: get-kids', body)
  const runtimeConfig = useRuntimeConfig()

  // If option is set, use mock data
  if (runtimeConfig.public.useMockApiData) {
    return new Promise(() => [
      {
        adjustments: [],
        allowance: 5,
        color: '#ff0000',
        id: 0,
        interest: 0.01,
        name: 'Kid 1',
        photoUrl: 'https://i.pravatar.cc/300',
        savingFor: 'https://i.pravatar.cc/600',
        savingForType: 'image',
        slug: 'kid-1'
      },
      {
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
    ])
  }

  // Get user from database
  async function runQuery () {
    const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1))

    let kids

    if (body?.includeAdjustments) {
      kids = await prisma.kid.findMany({
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
        }
      })
    } else {
      kids = await prisma.kid.findMany()
    }
    if (kids.length) {
      if (body?.screenshotMode) {
        return kids.map((kid, index) => {
          kid.name = `Kid ${index + 1}`
          kid.photoUrl = 'https://i.pravatar.cc/300'
          return kid
        })
      }
      return kids
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
