import { log } from '~/utils/console'
import prisma from '~/utils/prisma'
import { Kid } from '~/types'

export default defineEventHandler(async (event) => {
  log('API: save-kid')
  const body = await readBody(event)

  async function runQuery () {
    let saved

    // Clean up data
    if (typeof body.allowance !== 'number') {
      body.allowance = 0
    }
    if (typeof body.interest !== 'number') {
      body.allowance = 0
    }

    if (body.id > -1) {
      // If editing existing kid, get the existing record to update
      const newKid: Partial<Kid> = {}
      const existingKid = await prisma.kid.findUnique({
        where: {
          id: body.id
        }
      })
      if (existingKid) {
        Object.assign(newKid, existingKid)
        Object.assign(newKid, body)

        saved = await prisma.kid.update({
          data: newKid,
          where: {
            id: body.id
          }
        })

        if (saved) {
          console.log(`Kid created with name: ${newKid.name}`)
        }
      } else {
        console.error('Couldn’t find kid to edit')
      }
    } else {
      // Remove ID so a new one can be generated
      delete body.id
      saved = await prisma.kid.create({
        data: body
      })

      if (saved) {
        console.log(`Kid created with name: ${body.name}`)
      }
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
      throw e
      // process.exit(1)
    })
})
