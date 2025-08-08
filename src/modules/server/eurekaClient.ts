import { Eureka } from 'eureka-js-client'
import defer from 'p-defer'
import { appConfig } from '~/config/appConfig.ts'
import { logger } from '~/logger.ts'
import { ipUtil } from '~/util/ipUtil.ts'
import { server } from './server.ts'

const eureka = appConfig.eureka

let instanceId = ''

function initEurekaClient(e: Exclude<typeof eureka, undefined>) {
  const app = appConfig.name
  const ipAddr = ipUtil.v4(e.subnet)
  const port = appConfig.server.port
  instanceId = `${app}:${ipAddr}:${port}`
  e.port = e.port || 8761
  e.servicePath = e.servicePath || '/eureka/apps/'
  e.statusPagePath = e.statusPagePath || '/actuator/info'
  e.healthCheckPath = e.healthCheckPath || '/actuator/health'
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
      statusPageUrl: `http://${ipAddr}:${port}${e.statusPagePath}`,
      healthCheckUrl: `http://${ipAddr}:${port}${e.healthCheckPath}`,
    },
    eureka: {
      host: e.host,
      port: e.port,
      servicePath: e.servicePath,
    },
  })
}

export const eurekaClient = eureka ? initEurekaClient(eureka) : null

export default function () {
  if (eurekaClient) {
    if (eureka?.statusPagePath) {
      server.get(eureka.statusPagePath, (_req, res) => {
        res.json({})
      })
    }
    if (eureka?.healthCheckPath) {
      server.get(eureka.healthCheckPath, (_req, res) => {
        res.json({ status: 'UP' })
      })
    }
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
