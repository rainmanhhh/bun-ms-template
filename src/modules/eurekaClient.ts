import { Eureka } from 'eureka-js-client'
import defer from 'p-defer'
import { appConfig } from '../config/appConfig.ts'
import { logger } from '../logger.ts'
import { ipUtil } from '../util/ipUtil.ts'

const eureka = appConfig.eureka

function initEurekaClient(e: Exclude<typeof eureka, undefined>) {
  const ipAddr = ipUtil.v4(e.subnet)
  return new Eureka({
    instance: {
      app: appConfig.name,
      hostName: ipAddr,
      ipAddr,
      port: {
        '$': appConfig.server.port,
        '@enabled': true,
      },
      vipAddress: appConfig.name,
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        'name': 'MyOwn',
      },
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
  const d = defer<void>()
  eurekaClient?.start((err, _rest) => {
    if (err)
      d.reject(err)
    else
      d.resolve(logger.info('eureka client started'))
  })
  return d.promise
}
