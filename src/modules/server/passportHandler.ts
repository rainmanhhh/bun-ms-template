import type express from 'express'
import passport, { Strategy } from 'passport'
import { server } from './server.ts'

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
