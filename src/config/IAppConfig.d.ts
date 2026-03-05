import type { IDbConfig } from '~/config/IDbConfig'
import type { IEurekaConfig } from '~/config/IEurekaConfig'
import type { ILogConfig } from '~/config/ILogConfig'
import type { ISAKConfig } from '~/config/ISAKConfig'
import type { JwtConfig } from '~/util/jwt/JwtUtil.ts'

export interface IAppConfig {
  name: string
  server: {
    port: number
    failOnUnknownProperties?: boolean
  }
  log: ILogConfig
  eureka?: IEurekaConfig
  db?: IDbConfig
  /**
   * 网关地址，必须以斜杠`/`结尾
   */
  gateway: string
  /**
   * 微服务访问密钥ServiceApiKey配置
   */
  sak?: ISAKConfig
  jwt?: JwtConfig
  // busi: {}
}
