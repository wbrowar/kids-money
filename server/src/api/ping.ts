import { Request, Response } from 'express'
import { DbMessage } from '@/utils/db-response.ts'

export async function ping(req: Request, res: Response) {
  const message = `pong ${req.get('origin') ?? 'referrer not set'}`
  if (process.env.LOG_PING === 'true') {
    console.log(message)
  }
  const response = new DbMessage(message)
  res.status(200).send(JSON.stringify(response))
}
