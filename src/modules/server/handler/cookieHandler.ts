import cookieParser from 'cookie-parser'
import { server } from 'src/modules/server/server.ts'

export default function () {
  server.use(cookieParser())
}
export const order = -800
