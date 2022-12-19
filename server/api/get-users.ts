import { log } from '~/utils/console'
import prisma from '~/utils/prisma'

export default defineEventHandler(() => {
  log('API: get-users')

  async function runQuery () {
    const users = await prisma.user.findMany()
    if (users) {
      return users.map((user) => {
        return {
          grownUp: user.grownUp,
          username: user.username
        }
      })
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
