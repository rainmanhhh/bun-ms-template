import type { IBusiConfig } from '~/config/IBusiConfig'
import type { IDbConfig } from '~/config/IDbConfig'
import type { IEurekaConfig } from '~/config/IEurekaConfig'
import type { ILogConfig } from '~/config/ILogConfig'
import type { IRedisConfig } from '~/config/IRedisConfig'
import type { ISAKConfig } from '~/config/ISAKConfig'
import type { JwtConfig } from '~/util/jwt/JwtUtil.ts'

export interface IAppConfig {
  /**
   * 服务名（用于微服务注册中心）
   */
  name: string
  /**
   * 服务描述（说明性字段）
   */
  desc?: string
  /**
   * web端口配置
   */
  server: {
    port: number
    failOnUnknownProperties?: boolean
  }
  /**
   * 日志配置
   */
  log: ILogConfig
  /**
   * eureka连接配置
   */
  eureka?: IEurekaConfig
  /**
   * 数据库连接配置
   */
  db?: IDbConfig
  /**
   * redis缓存连接配置
   */
  redis?: IRedisConfig
  /**
   * 网关地址，必须以斜杠`/`结尾
   */
  gateway: string
  /**
   * 微服务访问密钥ServiceApiKey配置
   */
  sak?: ISAKConfig
  /**
   * json web token配置
   */
  jwt?: JwtConfig
  /**
   * 业务配置
   */
  busi: IBusiConfig
}
