import type { IEurekaConfig } from '~/config/IEurekaConfig'
import type { ILogConfig } from '~/config/ILogConfig'
import type { IDbConfig } from '~/config/IDbConfig'

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
  db?: IDbConfigUrl
  // busi: {}
}
