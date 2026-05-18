import type { MaybePromise } from '~/util/MaybePromise'
import { appConfig } from '~/config/appConfig.ts'
import { getRedis } from '~/modules/redis.ts'

export abstract class Cache<T> {
  /**
   * 缓存名称
   */
  public readonly cacheName: string
  /**
   * 缓存前缀
   */
  protected readonly cachePrefix: string
  /**
   * 缓存过期时间，单位秒
   */
  public readonly expireSeconds: number

  /**
   * 构造函数
   * @param cacheName 缓存名称
   * @param expireSeconds 缓存过期时间，单位秒。0表示永不过期。默认值为`appConfig.redis.expireSeconds`
   */
  protected constructor(
    cacheName: string,
    expireSeconds = appConfig.redis?.expireSeconds ?? 0
  ) {
    this.cacheName = cacheName
    this.cachePrefix = `${appConfig.name}:${cacheName}:`
    this.expireSeconds = expireSeconds
  }

  /**
   * 从缓存中获取指定键的值
   * @param key 缓存键。会自动添加前缀
   */
  abstract get(key: string | number): Promise<T | undefined>

  /**
   * 设置缓存中键的值
   * @param key 缓存键。会自动添加前缀
   * @param value 缓存值
   * @param expireSeconds 过期时间（秒）。不传则使用Cache实例构造时的默认值
   */
  abstract set(key: string | number, value: T, expireSeconds?: number): Promise<void>

  /**
   * 从缓存中删除指定键的值
   * @param key 缓存键。会自动添加前缀
   */
  evict(key: string | number) {
    return getRedis().del(this.getFullKey(key))
  }

  protected getFullKey(key: string | number): string {
    return this.cachePrefix + key.toString()
  }

  /**
   * 尝试从缓存中获取值，若不存在则计算并缓存
   * @param key
   * @param loader
   */
  async getOrCompute(key: string, loader: () => MaybePromise<T | undefined>): Promise<T | undefined> {
    const fullKey = this.getFullKey(key)
    const cachedValue = await this.get(fullKey)
    if (cachedValue != null)
      return cachedValue
    const value = await loader()
    if (value != null)
      await this.set(fullKey, value)
    return value
  }
}
