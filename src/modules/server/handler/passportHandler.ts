import passport from 'passport'
import { JwtStrategy } from 'src/util/jwt/JwtStrategy.ts'
import { jwtUtil } from 'src/util/jwt/JwtUtil.ts'
import { server } from '../server.ts'

passport.use(new JwtStrategy(jwtUtil))

export default function () {
  server.use(passport.initialize())
}

export const order = -500
