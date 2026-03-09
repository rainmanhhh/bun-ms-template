import type { PoolOptions } from 'mysql2'

/**
 * 数据库连接配置（drizzle）
 * - 此处默认为mysql的配置项，若更换其他数据库，则根据目标数据库驱动所需的配置类型修改定义
 * - 为符合drizzle类型要求，重写了PoolOptions的部分字段定义
 * - 每个服务仅需配置自己的db.database属性，其他可通过common.yml共享
 */
export interface IDbConfig extends PoolOptions {
  host: string
  database: string
  ssl?: string
  /**
   * join查询模式，默认为`default`
   * - planetscale用于兼容不支持lateral join的数据库，例如mysql5.x
   */
  mode?: 'default' | 'planetscale'
}
