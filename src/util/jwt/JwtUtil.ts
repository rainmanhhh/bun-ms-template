// JwtUtil.ts

import type { Algorithm, JwtPayload, Secret } from 'jsonwebtoken'
import type { JwtUser } from './JwtUser'
import jwt from 'jsonwebtoken'
import { appConfig } from '~/config/appConfig.ts'
import { Anon } from './JwtUser'

/**
 * JWT 配置项
 * - 字段默认值见 {@link defaultConfig}
 */
export interface JwtConfig {
  adminRole?: string
  cookieName?: string
  secretKey: string // base64 或原始字符串均可
  algorithm?: Algorithm // e.g. "HS256", "RS256"
  tokenExpireSeconds?: number // < 0 表示永不过期
  authorizationSchema?: string // 通常是 "Bearer"
  userField?: string // JWT claim 中的用户字段名，通常 "user"
}

const defaultConfig = {
  adminRole: 'admin',
  cookieName: 'JWT',
  secretKey: '',
  algorithm: 'HS256',
  tokenExpireSeconds: 1800,
  authorizationSchema: 'Bearer',
  userField: 'user',
} as const satisfies Required<JwtConfig>

export class JwtUtil {
  private readonly prefix: string
  private readonly secret: Secret
  readonly config: Required<JwtConfig>

  constructor(config: JwtConfig | undefined) {
    if (config) {
      for (const k in defaultConfig) {
        if (config[k] === undefined) {
          delete config[k]
        }
      }
    }
    this.config = Object.assign(defaultConfig, config)
    this.prefix = `${this.config.authorizationSchema} `
    this.secret = this.config.secretKey
  }

  /**
   * 创建纯 JWT（不带前缀）
   * @param user 用户信息
   * @param ttl 有效期（秒），<0 表示永不过期
   */
  createToken(user: JwtUser, ttl: number = this.config.tokenExpireSeconds): string {
    const payload: Record<string, any> = {
      [this.config.userField]: {
        id: user.id,
        roles: [...user.roles],
        perms: [...user.perms],
      },
    }

    const options: jwt.SignOptions = {
      algorithm: this.config.algorithm,
      expiresIn: ttl >= 0 ? `${ttl}s` : undefined,
      jwtid: crypto.randomUUID(), // 需要 import { randomUUID } from "crypto"
    }

    return jwt.sign(payload, this.secret, options)
  }

  /**
   * 创建带前缀的 token（通常用于 Authorization header）
   */
  createTokenWithPrefix(user: JwtUser, ttl?: number): string {
    const token = this.createToken(user, ttl)
    return this.prefix + token
  }

  /**
   * 验证不带前缀的纯 token
   * @throws Error 如果验证失败或过期
   */
  verifyToken(token: string): JwtUser {
    const decoded = jwt.verify(token, this.secret, {
      algorithms: [this.config.algorithm],
    }) as JwtPayload

    const userData = decoded[this.config.userField] as any
    if (!userData || typeof userData !== 'object') {
      throw new Error(`claims.${this.config.userField} is missing or invalid`)
    }

    const id = userData.id
    if (typeof id !== 'string') {
      throw new TypeError(`claims.${this.config.userField}.id is not a string`)
    }

    const roles = Array.isArray(userData.roles) ? userData.roles : []
    const perms = Array.isArray(userData.perms) ? userData.perms : []

    return {
      id,
      roles,
      perms,
    }
  }

  /**
   * 验证带前缀的 token（最常用的接口）
   * @throws Error 如果前缀不对或验证失败
   */
  verifyTokenWithPrefix(tokenWithPrefix: string): JwtUser | undefined {
    if (!this.verifySchema(tokenWithPrefix))
      return undefined
    const pureToken = tokenWithPrefix.substring(this.prefix.length)
    return this.verifyToken(pureToken)
  }

  /**
   * 检查是否以正确的 schema 前缀开头
   */
  verifySchema(tokenWithPrefix: string): boolean {
    return tokenWithPrefix.startsWith(this.prefix)
  }

  /**
   * 从 Authorization header 值（可能是数组）中提取并验证第一个符合的 token
   */
  verifyAuthHeader(authHeaders?: string | string[] | null): JwtUser {
    if (!authHeaders)
      return Anon

    const headers = Array.isArray(authHeaders) ? authHeaders : [authHeaders]

    for (const header of headers) {
      if (this.verifySchema(header)) {
        const user = this.verifyTokenWithPrefix(header)
        if (user)
          return user
        // else 空表示schema不符合，继续尝试下一个
      }
    }

    return Anon
  }
}

export const jwtUtil = new JwtUtil(appConfig.jwt)
