import { fastify } from 'fastify'
import { loggerConfig } from '../logger.ts'

const SERVER_PORT = 3000

export const server = fastify({
  logger: loggerConfig,
})

export default async function () {
  await server.listen({ port: SERVER_PORT })
}
