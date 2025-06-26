import type { Request } from 'express'
import { AsyncLocalStorage } from 'node:async_hooks'
import { server } from './server.ts'

const asyncLocalStorage = new AsyncLocalStorage()

function getStore() {
  const store = asyncLocalStorage.getStore()
  if (!store)
    throw new Error('current context is not in async hook')
  return store as { req: Request }
}

export const reqContext = {
  get req() {
    return getStore().req
  },
  set req(req: Request) {
    getStore().req = req
  },
  runWithReq(req: Request, callback: () => any) {
    asyncLocalStorage.run({ req }, callback)
  },
}

export default function () {
  server.use(async (req, res, next) => {
    reqContext.runWithReq(req, next)
  })
}
export const order = -1000
