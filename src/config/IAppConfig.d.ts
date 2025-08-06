export interface IAppConfig {
  name: string
  server: {
    port: number
    failOnUnknownProperties?: boolean
  }
  log: {
    /**
     * log level. default: `debug` if env is `development` or `test`; `info` if env is `production`
     */
    level: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly'
    /**
     * output to console. default set to `true` if env is `development` or `test`
     */
    console?: boolean
    /**
     * if not null, output to file. default set to `{}` if env is `production`
     */
    file?: {
      /**
       * log file name. default: ${appConfig.name}
       */
      name?: string
      /**
       * default: `log`
       */
      suffix?: string
      /**
       * max files to keep. can be count or days(with `d` suffix). default: `30d`
       */
      maxFiles?: string
      /**
       * max single file size. default: `128m`
       */
      maxSize?: string
    }
  }
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
    /**
     * app status page path. should start with `/`. default value is `/actuator/info`
     */
    statusPagePath?: string
    /**
     * app health check path. should start with `/`. default value is `/actuator/health`
     */
    healthCheckPath?: string
  }
  // busi: {}
}
