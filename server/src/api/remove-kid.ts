import { Request, Response } from 'express'
import { prisma } from '@/utils/prisma.ts'
import { DbError, DbMessage } from '@/utils/db-response.ts'

/**
 * Removes a row from the Kid table in the database.
 *
 * @param {Request} req The request object containing parameters to be passed in.
 * @param {Response} res The response object sent back to the client.
 */
export async function removeKid(req: Request, res: Response) {
  console.log('removeKid', req.body)

  let response

  await prisma.adjustment.deleteMany({
    where: {
      kidId: req.body.id,
    },
  })

  const deletedKid = await prisma.kid.delete({
    where: {
      id: req.body.id,
    },
  })

  if (deletedKid) {
    response = new DbMessage(`Kid removed: ${req.body.name}`)
  } else {
    response = new DbError('Couldn’t find kid to edit')
  }

  res.send(JSON.stringify(response))

  await prisma.$disconnect()
}
