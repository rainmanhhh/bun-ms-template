import type { MaybePromise } from '~/util/MaybePromise'
import { appConfig } from '~/config/appConfig.ts'
import { getRedis } from '~/modules/redis.ts'

export const DEFAULT_EXPIRE_SECONDS = 1800

export abstract class AbstractCache<T> {
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
   * @param loader 缓存值加载函数
   * @param expireSeconds 缓存过期时间，单位秒。0表示永不过期。不传则使用{@link appConfig.redis.expireSeconds}
   */
  protected constructor(
    cacheName: string,
    loader: (key: string | number) => MaybePromise<T | undefined>,
    expireSeconds = appConfig.redis?.expireSeconds ?? DEFAULT_EXPIRE_SECONDS,
  ) {
    this.cacheName = cacheName
    this.cachePrefix = `${appConfig.name}:${cacheName}:`
    this.loader = loader
    this.expireSeconds = expireSeconds
  }

  /**
   * 从缓存中读取原始的字符串值
   * - 若缓存中不存在该键，则调用`loader`函数加载并缓存该键的值
   * @param key 缓存键。会自动添加前缀
   */
  protected async getStr(key: string | number): Promise<string | null> {
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
   * 直接向缓存中设置原始的字符串值
   * @param key 缓存键。会自动添加前缀
   * @param value 字符串形式的原始缓存值
   * @param expireSeconds 过期时间（秒）。不传则使用Cache实例构造时的默认值
   */
  protected async setStr(key: string | number, value: string, expireSeconds?: number): Promise<void> {
    const fullKey = this.getFullKey(key)
    await getRedis().set(fullKey, value, 'EX', expireSeconds ?? this.expireSeconds)
  }

  /**
   * 从缓存中获取指定键的值
   * - 若缓存中不存在该键，则调用`loader`函数加载并缓存该键的值
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
}
