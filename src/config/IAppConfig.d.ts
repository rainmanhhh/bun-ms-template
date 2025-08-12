import type { IDbConfig } from '~/config/IDbConfig'
import type { IEurekaConfig } from '~/config/IEurekaConfig'
import type { ILogConfig } from '~/config/ILogConfig'

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
  db?: IDbConfig
  // busi: {}
}
