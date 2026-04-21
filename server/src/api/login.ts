import { Request, Response } from 'express'
import { prisma } from '@/utils/prisma.ts'
import { DbError } from '@/utils/db-response.ts'

export async function login(req: Request, res: Response) {
  if (!(req.body.username && req.body.password)) {
    return res.status(400).send(new DbError('Missing username or password'))
  }

  const user = await prisma.user.findFirst({
    where: {
      username: req.body.username,
      password: req.body.password,
    },
  })

  if (!user) {
    return res.status(400).send(new DbError('No user found with that username and password'))
  }

  res.send(
    JSON.stringify({
      grownUp: user.grownUp,
      username: user.username,
    })
  )

  await prisma.$disconnect()
}
