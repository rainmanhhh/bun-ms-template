import type { NextFunction, Request, Response } from 'express'
import { logger } from '~/logger.ts'
import { server } from './server.ts'

export default function () {
  server.use((err: Error | any | null, _req: Request, res: Response, next: NextFunction) => {
    if (err) {
      let message = ''
      if (err instanceof Error) {
        message = err.message
        logger.error('web error:', err)
      } else {
        message = String(err)
        logger.error('web error: %s', message)
      }
      res.status(500).json({ code: 500, message })
    } else {
      next()
    }
  })
}
export const order = 999
