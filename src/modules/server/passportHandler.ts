import type express from 'express'
import passport, { Strategy } from 'passport'
import { server } from './server.ts'

/**
 * 自定义apiKey处理器示例
 * - 继承`passport`库提供的`Strategy`基类
 * - `name`属性的值与openapi schema中定义的`security`名称（`apiKey1`）一致
 * - `authenticate`方法从http header中获取token（name=`X-API-KEY`），与openapi schema中定义的`securitySchemes.apiKey1`内容保持一致
 */
class ApiKey1Strategy extends Strategy {
  name = 'apiKey1'

  authenticate(req: express.Request, _options?: any) {
    const token: string = req.header('X-API-KEY') || ''
    this.success({
      id: '',
      name: '',
      token
    })
  }
}

passport.use(new ApiKey1Strategy())

export default function () {
  server.use(passport.initialize())
}

export const order = -500
