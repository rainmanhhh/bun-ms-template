import { fastify } from 'fastify'
import { appConfig } from '../appConfig.ts'

const SERVER_PORT = 3000

export const server = fastify({
  logger: appConfig.log,
  disableRequestLogging: true,
})

server.addHook('onResponse', (req, reply, done) => {
  type LogLevel = keyof typeof reply.log
  let lvl: LogLevel
  if (reply.statusCode >= 200 && reply.statusCode < 300) {
    lvl = 'debug'
  } else if (reply.statusCode >= 300 && reply.statusCode < 400) {
    lvl = 'info'
  } else if (reply.statusCode >= 400 && reply.statusCode < 500) {
    lvl = 'warn'
  } else if (reply.statusCode >= 500) {
    lvl = 'error'
  } else {
    lvl = 'info'
  }
  // todo error stack
  reply.log[lvl]('[%s %s %d] cost: %sms', req.method, req.url, reply.statusCode, reply.elapsedTime.toFixed(0))
  done()
})

export default async function () {
  await server.listen({ port: SERVER_PORT })
}
