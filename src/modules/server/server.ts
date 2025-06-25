import express from 'express'
import { appConfig } from '../../config/appConfig.ts'
import { logger } from '../../logger.ts'

export const server = express()

export default async function () {
  server.listen(appConfig.server.port)
  logger.info('server listening on port %d', appConfig.server.port)
}
export const order = 1000
