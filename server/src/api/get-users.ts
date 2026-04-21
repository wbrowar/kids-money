import { Request, Response } from 'express'
import { prisma } from '@/utils/prisma.ts'
import { User } from 'types'

type UserWithoutId = Omit<User, 'id'>

export async function getUsers(_req: Request, res: Response) {
  let response: UserWithoutId[] = []

  const users = await prisma.user.findMany()
  if (users) {
    response = users.map((user: UserWithoutId) => {
      return {
        grownUp: user.grownUp,
        username: user.username,
      }
    })
  }

  res.send(JSON.stringify(response))

  await prisma.$disconnect()
}
