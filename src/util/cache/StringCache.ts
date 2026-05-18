import { getRedis } from '~/modules/redis.ts'
import { Cache } from './Cache'

/**
 * 字符串缓存
 */
export class StringCache extends Cache<string> {
  constructor(cacheName: string, expireSeconds?: number) {
    super(cacheName, expireSeconds)
  }

  async get(key: string): Promise<string | undefined> {
    const fullKey = this.getFullKey(key)
    return await getRedis().get(fullKey) ?? undefined
  }

  async set(key: string, value: string, expireSeconds = this.expireSeconds): Promise<void> {
    const redis = getRedis()
    const fullKey = this.getFullKey(key)
    if (expireSeconds)
      await redis.set(fullKey, value, 'EX', expireSeconds)
    else
      await redis.set(fullKey, value)
  }
}
