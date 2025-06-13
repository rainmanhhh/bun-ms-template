import express from 'express'
import { appConfig } from '../../config/appConfig'
import { routesDefer } from './routes.ts'

export const server = express()

export default async function () {
  await routesDefer.promise // wait routes setup
  server.listen(appConfig.server.port)
}
