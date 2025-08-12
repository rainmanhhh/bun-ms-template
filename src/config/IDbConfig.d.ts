/**
 * 数据库连接配置（drizzle）
 */
export interface IDbConfig {
  /**
   * 数据库连接串，例如`mysql://root:password@localhost:3306/mydb`
   */
  url: string
  /**
   * join查询模式，默认为`default`
   * - planetscale用于兼容不支持lateral join的数据库，例如mysql5.x
   */
  mode?: 'default' | 'planetscale'
}
