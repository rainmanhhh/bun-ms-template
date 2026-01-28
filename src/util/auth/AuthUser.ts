// user.types.ts 或 app-user.ts

import type { JwtUser } from '~/util/jwt/JwtUser.ts' // 假设你已有 JwtUser 接口/类型
import { UserType } from '~/util/auth/UserType.ts'
import { HttpStatusError } from '~/util/HttpStatusError.ts'

export class AuthUser {
  constructor(readonly jwtUser: JwtUser) {}

  getIdOrNull(userType: UserType): string | null {
    const prefix = `user:${userType}:`
    for (const role of this.jwtUser.roles) {
      if (role.startsWith(prefix)) {
        const userId = role.substring(prefix.length)
        if (userId)
          return userId
      }
    }
    return null
  }

  getId(userType: UserType): string {
    const id = this.getIdOrNull(userType)
    if (id === null) {
      throw new HttpStatusError(403, `user ${this.jwtUser.id} is not ${userType}`)
    }
    return id
  }

  getPubUserIdOrNull(): number | null {
    const idStr = this.getIdOrNull(UserType.PubUser)
    return idStr ? Number(idStr) : null
  }

  getPubUserId(): number {
    const idStr = this.getId(UserType.PubUser)
    const num = Number(idStr)
    if (Number.isNaN(num)) {
      throw new HttpStatusError(403, 'PubUser ID is not a valid number')
    }
    return num
  }

  getStaffIdOrNull(): number | null {
    const idStr = this.getIdOrNull(UserType.Staff)
    return idStr ? Number(idStr) : null
  }

  getStaffId(): number {
    const idStr = this.getId(UserType.Staff)
    const num = Number(idStr)
    if (Number.isNaN(num)) {
      throw new HttpStatusError(403, 'Staff ID is not a valid number')
    }
    return num
  }

  /**
   * 检查当前用户是否匹配期望的用户ID（常用于“只能操作自己的数据”场景）
   * @param expectedUserId 期望的ID（字符串或数字），null 表示不做校验
   * @param userType 校验的用户类型，默认为 PubUser
   * @throws Error 403 Forbidden 当不匹配时
   */
  checkUser(expectedUserId: string | number | null, userType: UserType = UserType.PubUser): void {
    if (expectedUserId == null)
      return
    const currentId = this.getId(userType)
    // 宽松比较（字符串或数字都支持）
    const expected = String(expectedUserId)
    if (currentId !== expected) {
      throw new HttpStatusError(403, `current user doesn't match the expected: ${userType}-${expectedUserId}`)
    }
  }
}
