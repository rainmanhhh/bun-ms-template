export interface JwtUser {
  id: string
  roles: string[]
  perms: string[]
}

export const Anon: JwtUser = {
  id: '',
  roles: [],
  perms: [],
}

export function isAnon(user: JwtUser): boolean {
  return user.id === ''
}

// 类型守卫（可选，根据需要使用）
export function isJwtUser(value: any): value is JwtUser {
  return (
    value
    && typeof value === 'object'
    && typeof value.id === 'string'
    && Array.isArray(value.roles)
    && Array.isArray(value.perms)
  )
}
