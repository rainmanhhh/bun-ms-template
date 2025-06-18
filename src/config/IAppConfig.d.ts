import type { LoggerOptions } from 'pino'

export interface IAppConfig {
  name: string
  server: {
    port: number
    failOnUnknownProperties?: boolean
  }
  log: LoggerOptions
  eureka?: {
    /**
     * eureka server host, eg: `localhost`
     */
    host: string
    /**
     * eureka server port, default value is 8761
     */
    port?: number
    /**
     * eureka server service path, default value is `/eureka/apps/`
     */
    servicePath?: string
    /**
     * subnet pattern for app ip address, eg: `192.168.1.0/24`. if not set, the first ip address will be used
     */
    subnet?: string
  }
}
