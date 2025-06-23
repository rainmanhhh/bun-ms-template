import type { ApiImplementation } from '../../generated/server/types.ts'
import express from 'express'
import { appConfig } from '../../config/appConfig'
import setupRoutes from '../../generated/server'
import { logger } from '../../logger.ts'

export const routes: Partial<ApiImplementation> = {}

export const server = express()

export default async function () {
  const apis = routes as ApiImplementation
  setupRoutes(server, apis, {
    failOnUnknownProperties: appConfig.server.failOnUnknownProperties
  })
  logger.debug('%d routes registered', Object.keys(apis).length)
  server.listen(appConfig.server.port)
  logger.info('server listening on port %d', appConfig.server.port)
}
