import type express from 'express'
import { logger } from '../../logger.ts'
import { server } from './server.ts'

server.use((err: Error | null, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err) {
    logger.error('Unhandled error', err)
    res.status(500).json({ code: 500, message: err.message })
  } else {
    next()
  }
})
