import type { NextFunction, Request, Response } from 'express'
import { logger } from '../../logger.ts'
import { server } from './server.ts'

export default function () {
  server.use((err: Error | null, _req: Request, res: Response, next: NextFunction) => {
    if (err) {
      logger.error('Unhandled error', err)
      res.status(500).json({ code: 500, message: err.message })
    } else {
      next()
    }
  })
}
export const order = 999
