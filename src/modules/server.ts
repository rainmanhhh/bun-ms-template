import type { ApiImplementation } from '../generated/server/types'
import express from 'express'
import { appConfig } from '../appConfig.ts'
import setupRoutes from '../generated/server'
import { logger } from '../logger.ts'

export const apis: Partial<ApiImplementation> = {}

export const server = express()

server.use((err: Error | null, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err) {
    logger.error(err, 'Unhandled error')
    res.status(500).json({ code: 500, message: err.message })
  } else {
    next()
  }
})

export default async function () {
  setupRoutes(server, apis as ApiImplementation)
  server.listen(appConfig.port)
}
