import { Request, Response } from 'express'
import { prisma } from '@/utils/prisma.ts'
import { User } from '@types'

type UserWithoutId = Pick<User, 'grownUp' | 'kidId' | 'username'>

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
