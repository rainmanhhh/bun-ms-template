import type { MaybePromise } from '~/util/MaybePromise'
import { AbstractCache } from '~/util/cache/AbstractCache.ts'

/**
 * Json缓存实例类
 * - 缓存值以Json方式序列化
 */
export class JsonCache<T> extends AbstractCache<T> {
  /**
   * 构造函数
   * @param cacheName 缓存名称
   * @param loader 缓存值加载函数
   * @param expireSeconds 缓存过期时间，单位秒。0表示永不过期。不传则使用{@link appConfig.redis.expireSeconds}
   */
  constructor(
    cacheName: string,
    loader: (key: string | number) => MaybePromise<T | undefined>,
    expireSeconds?: number,
  ) {
    super(cacheName, loader, expireSeconds)
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

  /**
   * 设置缓存中键的值
   * @param key 缓存键。会自动添加前缀
   * @param value 缓存值
   * @param expireSeconds 过期时间（秒）。不传则使用Cache实例构造时的默认值
   */
  async set(key: string | number, value: T, expireSeconds?: number): Promise<void> {
    await this.setStr(key, JSON.stringify(value), expireSeconds)
  }
}
