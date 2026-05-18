import { Redis } from 'ioredis'
import defer from 'p-defer'
import { appConfig } from 'src/config/appConfig.ts'
import { getLogger } from 'src/logger.ts'

const logger = getLogger('redisClient')

const { redis: redisConfig } = appConfig

/**
 * 创建并初始化 Redis 客户端（包含连接等待 + 5秒超时）
 * 与你的 initEurekaClient 结构完全一致
 */
async function createRedisClient(conf: NonNullable<typeof redisConfig>) {
  // 1. 创建客户端
  const client = new Redis({
    host: conf.host,
    port: conf.port,
    password: conf.password,
    db: conf.db,
    connectTimeout: 5000,
    retryStrategy: (times) => {
      // 1. 超过最大重试次数 → 停止重试
      if (conf.retryTimes != null && times > conf.retryTimes)
        return null
      // 2. 配置了固定间隔 → 直接返回固定值
      if (conf.retryInterval != null)
        return conf.retryInterval
      // 3. 都不配置 → 使用 ioredis 官方默认策略（指数退避）
      return times > 40 ? 2000 : times * 50
    },
  })

  // 2. 日志监听
  client.on('connect', () => {
    logger.info('Redis connecting：%s:%s', conf.host, conf.port ?? 6379)
  })

  client.on('ready', () => {
    logger.info('Redis connected（DB：%d）', conf.db ?? 0)
  })

  client.on('error', (err) => {
    logger.error('Redis error：%s', err.message)
  })

  client.on('close', () => {
    logger.info('Redis closed')
  })

  // 3. 等待连接就绪 + 5秒超时（Promise.race）
  const readyDefer = defer<void>()
  client.once('ready', () => readyDefer.resolve())
  client.once('error', (err) => readyDefer.reject(err))

  const initTimeout = conf.initTimeout || 5000
  const timeoutPromise = new Promise<void>((_, reject) => {
    setTimeout(() => reject(new Error('Redis init timeout')), initTimeout)
  })

  await Promise.race([readyDefer.promise, timeoutPromise])

  // 4. 健康检查
  await client.ping()
  logger.info('Redis health check passed')

  return client
}

const redisPromise = redisConfig
  ? createRedisClient(redisConfig)
  : null
let redis: Redis | undefined

export function getRedis() {
  if (!redis)
    throw new Error('Redis client not initialized')
  return redis
}

export default async function () {
  if (redisPromise)
    redis = await redisPromise
}
