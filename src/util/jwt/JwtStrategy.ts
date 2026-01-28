import type { Request } from 'express'
import type { JwtUtil } from '~/util/jwt/JwtUtil.ts'
import { Strategy } from 'passport'
import { Anon } from '~/util/jwt/JwtUser.ts'

export class JwtStrategy extends Strategy {
  public name = 'jwt' // 常用简短名称，路由里用 passport.authenticate('jwt', ...)

  constructor(
    private jwtUtil: JwtUtil
  ) {
    super()
  }

  authenticate(req: Request): void {
    // 1. 优先从 Authorization header 尝试提取
    let tokenWithPrefix: string | undefined = this.extractFromHeader(req)

    // 2. 如果 header 没有，再从 cookie 里取
    if (!tokenWithPrefix) {
      tokenWithPrefix = this.extractFromCookie(req)
    }

    // 3. 两者都没有 → 匿名用户，继续往下走（不抛 401）
    if (!tokenWithPrefix) {
      this.success(Anon)
      return
    }

    // 4. 有 token → 验证
    try {
      const user = this.jwtUtil.verifyTokenWithPrefix(tokenWithPrefix)
      if (user)
        this.success(user)
      else
        return this.fail({ message: 'cookie jwt schema not match' })
    } catch (err: any) {
      // 模仿 kotlin 的行为：过期明确返回 401 + 信息，其他错误也失败
      if (err.name === 'TokenExpiredError' || err.message?.includes('ExpiredJwtException')) {
        return this.fail({ message: `Token 已过期: ${err.message}` }, 401)
      }
      return this.fail({ message: err.message || 'jwt invalid' }, 401)
    }
  }

  /**
   * 从 Authorization header 提取（只接受带有正确前缀的）
   */
  private extractFromHeader(req: Request): string | undefined {
    const auth = req.headers.authorization
    if (!auth)
      return undefined

    // 模仿 kotlin：取第一个符合 schema 的
    // 实际 express 中 headers.authorization 通常是单个字符串
    if (this.jwtUtil.verifySchema(auth)) {
      return auth
    }
    return undefined
  }

  /**
   * 从 cookie 提取，并做 url decode + 前缀检查
   */
  private extractFromCookie(req: Request): string | undefined {
    const cookieValue = req.cookies?.[this.jwtUtil.config.cookieName]
    if (!cookieValue)
      return undefined

    let decoded: string
    try {
      decoded = decodeURIComponent(cookieValue)
    } catch {
      return undefined
    }

    if (this.jwtUtil.verifySchema(decoded)) {
      return decoded
    }
    return undefined
  }
}
