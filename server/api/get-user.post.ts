import { log } from '~/utils/console'
import prisma from '~/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  log('API: get-user', body)
  const runtimeConfig = useRuntimeConfig()

  // If option is set, use mock data
  if (runtimeConfig.public.useMockApiData) {
    return {
      grownUp: true,
      id: 0,
      username: 'frank'
    }
  }

  // Get user from database
  async function runQuery () {
    if (body.username) {
      const user = await prisma.user.findUnique({
        where: {
          username: body.username
        }
      })
      if (user) {
        return {
          grownUp: user.grownUp,
          username: user.username
        }
      }
    }
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
