import type { MaybePromise } from '~/util/MaybePromise'
import { appConfig } from '~/config/appConfig.ts'
import { getRedis } from '~/modules/redis.ts'

export class Cache<T> {
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
   * 缓存值加载函数
   * - 当缓存中不存在该键时，调用该函数加载并缓存该键的值
   */
  public loader: (key: string | number) => MaybePromise<T | undefined>

  /**
   * 构造函数
   * @param cacheName 缓存名称
   * @param expireSeconds 缓存过期时间，单位秒。0表示永不过期。默认值为`appConfig.redis.expireSeconds`
   * @param loader 缓存值加载函数
   */
  protected constructor(
    cacheName: string,
    expireSeconds = appConfig.redis?.expireSeconds ?? 0,
    loader: (key: string | number) => MaybePromise<T | undefined>,
  ) {
    this.cacheName = cacheName
    this.cachePrefix = `${appConfig.name}:${cacheName}:`
    this.expireSeconds = expireSeconds
    this.loader = loader
  }

  /**
   * 从缓存中读取原始的字符串值
   * - 若缓存中不存在该键，则调用`loader`函数加载并缓存该键的值
   * @param key
   */
  async getStr(key: string | number): Promise<string | null> {
    const fullKey = this.getFullKey(key)
    let str = await getRedis().get(fullKey)
    if (str == null) {
      const value = await this.loader(key)
      if (value != null) {
        str = JSON.stringify(value)
        await this.setStr(key, str)
      }
    }
    return str
  }

  /**
   * 从缓存中获取指定键的值
   * - 若缓存中不存在该键，则调用`loader`函数加载并缓存该键的值
   * @param key 缓存键。会自动添加前缀
   */
  async get(key: string | number): Promise<T | undefined> {
    const str = await this.getStr(key)
    if (str)
      return JSON.parse(str) ?? undefined
    else
      return undefined
  }

  async setStr(key: string | number, value: string, expireSeconds?: number): Promise<void> {
    const fullKey = this.getFullKey(key)
    await getRedis().set(fullKey, value, 'EX', expireSeconds ?? this.expireSeconds)
  }

  /**
   * 设置缓存中键的值
   * @param key 缓存键。会自动添加前缀
   * @param value 缓存值
   * @param expireSeconds 过期时间（秒）。不传则使用Cache实例构造时的默认值
   */
  async set(key: string | number, value: T, expireSeconds?: number): Promise<void> {
    await this.setStr(key, JSON.stringify(value), expireSeconds)
  }

  /**
   * 从缓存中删除指定键的值
   * @param key 缓存键。会自动添加前缀
   */
  evict(key: string | number) {
    return getRedis().del(this.getFullKey(key))
  }

  private getFullKey(key: string | number): string {
    return this.cachePrefix + key.toString()
  }
}
