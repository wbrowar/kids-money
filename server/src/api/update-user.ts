import { Request, Response } from 'express'
import { prisma } from '@/utils/prisma.ts'
import { DbError, DbMessage } from '@/utils/db-response.ts'
import { User } from '@types'

/**
 * Updates a user when a username is passed in.
 *
 * @param req The request object containing parameters to be passed in.
 * @param res The response object sent back to the client.
 */
export async function updateUser(req: Request, res: Response) {
  console.log('updateUser', req.body)

  let response
  let saved

  if (req.body.username) {
    // Get the existing user record to update
    const newUser = {}
    const existingUser = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    })
    if (existingUser) {
      Object.assign(newUser, existingUser)
      Object.assign(newUser, req.body)

      // Remove ID because it will not be updated
      delete (newUser as Partial<User>).id

      saved = await prisma.user.update({
        data: newUser,
        where: {
          id: existingUser.id,
        },
      })

      if (saved) {
        response = new DbMessage(`User updated with name: ${(newUser as User).username}`)
      } else {
        response = new DbError('An error occurred while updating user.')
      }
    } else {
      response = new DbError('Couldn’t find user to edit.')
    }
  }

  res.send(JSON.stringify(response))

  await prisma.$disconnect()
}
