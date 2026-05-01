import { Request, Response } from 'express'
import { DbMessage } from '@/utils/db-response.ts'

/**
 * Checks to see if the server is running.
 *
 * @param req The request object containing parameters to be passed in.
 * @param res The response object sent back to the client.
 */
export async function ping(req: Request, res: Response) {
  const message = `pong ${req.get('origin') ?? 'referrer not set'}`
  if (process.env.LOG_PING === 'true') {
    console.log(message)
  }
  const response = new DbMessage(message)
  res.status(200).send(JSON.stringify(response))
}
