import { Request, Response } from 'express'
import { DbMessage } from '@/utils/db-response.ts'

export async function ping(req: Request, res: Response) {
  const response = new DbMessage(`pong ${req.get('origin') ?? 'referrer not set'}`)
  res.status(200).send(JSON.stringify(response))
}
