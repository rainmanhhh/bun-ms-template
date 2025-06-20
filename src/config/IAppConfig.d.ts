export interface IAppConfig {
  name: string
  server: {
    port: number
    failOnUnknownProperties?: boolean
  }
  log: {
    level: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly'
    /**
     * output to console. default: false
     */
    console?: boolean
    /**
     * if not null, output to file.
     */
    file?: {
      /**
       * eg: `app`
       */
      name: string
      /**
       * default: `log`
       */
      suffix?: string
      /**
       * default: `30d`
       */
      ttl?: string
      /**
       * default: `128m`
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
  }
}
