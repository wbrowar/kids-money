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
  const whereParams:{
    username: string;
    password?: string;
  } = {
    username: body.username
  }
  if (body.password) {
    whereParams.password = body.password
  }
  async function runQuery () {
    if (body.username) {
      const user = await prisma.user.findFirst({
        where: whereParams
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
      throw e
      // process.exit(1)
    })

  return response
})
