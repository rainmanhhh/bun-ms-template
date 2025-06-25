/**
 * crypto.getRandomValues()
 * crypto.randomUUID()
 * crypto.randomBytes()
 */
import 'polyfill-crypto-methods'

export const uuidUtil = {
  /**
   * 创建一个新的uuid（v4）
   * @param removeDash 是否去除默认自带的短横线，不去除则长度为36，去除则为32
   */
  create(removeDash = false) {
    const uuid = crypto.randomUUID()
    return removeDash ? uuid.replaceAll('-', '') : uuid
  }
}
