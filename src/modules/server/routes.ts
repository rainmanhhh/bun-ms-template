import type { DeferredPromise } from 'p-defer'
import type { ApiImplementation } from '../../generated/server/types.ts'
import defer from 'p-defer'
import { appConfig } from '../../appConfig.ts'
import setupRoutes from '../../generated/server'
import { logger } from '../../logger.ts'
import { server } from './server.ts'

export const routes: Partial<ApiImplementation> = {}

export const routesDefer: DeferredPromise<ApiImplementation> = defer()

export default function () {
  const apis = routes as ApiImplementation
  setupRoutes(server, apis, {
    failOnUnknownProperties: appConfig.server.failOnUnknownProperties
  })
  logger.info('%d routes registered', Object.keys(apis).length)
  routesDefer.resolve(apis)
}
