import type { ApiImplementation } from '../../generated/server/types.ts'
import { appConfig } from '../../config/appConfig.ts'
import setupRoutes from '../../generated/server'
import { logger } from '../../logger.ts'
import { server } from './server.ts'

export const routes: Partial<ApiImplementation> = {}

export default function () {
  const apis = routes as ApiImplementation
  setupRoutes(server, apis, {
    failOnUnknownProperties: appConfig.server.failOnUnknownProperties
  })
  logger.debug('%d routes registered', Object.keys(apis).length)
}
export const order = 500
