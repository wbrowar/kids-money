import { Request, Response } from 'express'
import { prisma } from '@/utils/prisma.ts'
import { User } from '@types'

type UserWithoutId = Pick<User, 'grownUp' | 'kidId' | 'username'>

/**
 * Gets all users stored in the database.
 *
 * @param {Request} _req The request object containing parameters to be passed in.
 * @param {Response} res The response object sent back to the client.
 */
export async function getUsers(_req: Request, res: Response) {
  let response: UserWithoutId[] = []

  const users = (await prisma.user.findMany()) as UserWithoutId[]
  if (users) {
    response = users.map((user: UserWithoutId) => {
      return {
        grownUp: user.grownUp,
        kidId: user.kidId || undefined,
        username: user.username,
      }
    })
  }

  res.send(JSON.stringify(response))

  await prisma.$disconnect()
}
