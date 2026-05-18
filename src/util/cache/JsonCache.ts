import { getRedis } from '~/modules/redis.ts'
import { Cache } from './Cache'

/**
 * JSON缓存
 */
export class JsonCache<T> extends Cache<T> {
  constructor(cacheName: string, expireSeconds?: number) {
    super(cacheName, expireSeconds)
  }

  async get(key: string): Promise<T | undefined> {
    const fullKey = this.getFullKey(key)
    const strValue = await getRedis().get(fullKey)
    return strValue ? JSON.parse(strValue) : undefined
  }

  async set(key: string, value: T, expireSeconds = this.expireSeconds): Promise<void> {
    const redis = getRedis()
    const jsonValue = JSON.stringify(value)
    const fullKey = this.getFullKey(key)
    if (expireSeconds)
      await redis.set(fullKey, jsonValue, 'EX', expireSeconds)
    else
      await redis.set(fullKey, jsonValue)
  }
}
