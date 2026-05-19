import type { MaybePromise } from '~/util/MaybePromise'
import { AbstractCache } from '~/util/cache/AbstractCache.ts'

/**
 * 字符串缓存实例类
 * - 只接收字符串格式的缓存值，无需额外序列化转换
 */
export class StringCache extends AbstractCache<string> {
  /**
   * 构造函数
   * @param cacheName 缓存名称
   * @param loader 缓存值加载函数
   * @param expireSeconds 缓存过期时间，单位秒。0表示永不过期。不传则使用{@link appConfig.redis.expireSeconds}
   */
  constructor(
    cacheName: string,
    loader: (key: string | number) => MaybePromise<string | undefined>,
    expireSeconds?: number,
  ) {
    super(cacheName, loader, expireSeconds)
  }

  async get(key: string | number): Promise<string | undefined> {
    return await this.getStr(key) ?? undefined
  }

  async set(key: string | number, value: string, expireSeconds?: number): Promise<void> {
    return await this.setStr(key, value, expireSeconds)
  }
}
