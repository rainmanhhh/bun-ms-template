import type { RedisOptions } from 'ioredis'

type IRedisConfig = Omit<RedisOptions, 'retryStrategy'> & {
  /**
   * 建立/重连TCP时，最大重试次数。不设置则无限重试
   */
  retryTimes?: number
  /**
   * 建立/重连TCP时，重试间隔时间。单位：毫秒。不设置则从50毫秒开始指数递增，最大2000毫秒
   */
  retryInterval?: number
  /**
   * 初始化redisClient超时时间。单位：毫秒
   * @default 5000
   */
  initTimeout?: number
  /**
   * 健康检查接口路径
   * @default '/actuator/redis'
   */
  statusCheckPath?: string
}
