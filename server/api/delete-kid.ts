import { log } from '~/utils/console'
import prisma from '~/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  log('API: delete-kid', body)

  async function runQuery () {
    const deleted = await prisma.kid.delete({
      where: {
        id: body.id
      }
    })

    if (deleted) {
      console.log(`Kid created with name: ${body.name}`)
    }
  }

  return runQuery()
    .then(async () => {
      await prisma.$disconnect()
      return true
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
})
