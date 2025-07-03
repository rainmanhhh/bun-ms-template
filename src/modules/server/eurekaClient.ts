import { Eureka } from 'eureka-js-client'
import defer from 'p-defer'
import { appConfig } from '../../config/appConfig.ts'
import { logger } from '../../logger.ts'
import { ipUtil } from '../../util/ipUtil.ts'
import { server } from './server.ts'

const eureka = appConfig.eureka

let instanceId = ''

function initEurekaClient(e: Exclude<typeof eureka, undefined>) {
  const app = appConfig.name
  const ipAddr = ipUtil.v4(e.subnet)
  const port = appConfig.server.port
  instanceId = `${app}:${ipAddr}:${port}`
  return new Eureka({
    instance: {
      app,
      hostName: ipAddr,
      ipAddr,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: app,
      instanceId,
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        'name': 'MyOwn',
      },
      homePageUrl: `http://${ipAddr}:${port}/`,
      statusPageUrl: `http://${ipAddr}:${port}/actuator/info`,
      healthCheckUrl: `http://${ipAddr}:${port}/actuator/health`,
    },
    eureka: {
      host: e.host,
      port: e.port || 8761,
      servicePath: e.servicePath || '/eureka/apps/',
    },
  })
}

export const eurekaClient = eureka
  ? initEurekaClient(eureka)
  : null

export default function () {
  if (eurekaClient) {
    server.get('/actuator/info', (_req, res) => {
      res.json({})
    })
    server.get('/actuator/health', (_req, res) => {
      res.json({ status: 'UP' })
    })
    const d = defer<void>()
    eurekaClient.start((err, _rest) => {
      if (err)
        d.reject(err)
      else
        d.resolve()
    })
    d.promise.then(() => logger.info('eureka client started. instanceId: %s', instanceId))
    return d.promise
  }
}
