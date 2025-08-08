import type { IEurekaConfig } from './IEurekaConfig'
import type { ILogConfig } from './ILogConfig'

export interface IAppConfig {
  name: string
  server: {
    port: number
    failOnUnknownProperties?: boolean
  }
  log: ILogConfig
  eureka?: IEurekaConfig
  /**
   * eg.`mysql://root:password@localhost:3306/mydb`
   */
  dbUrl?: string
  // busi: {}
}
