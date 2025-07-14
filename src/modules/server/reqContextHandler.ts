import type { Request, Response } from 'express'
import { AsyncLocalStorage } from 'node:async_hooks'
import { server } from './server.ts'

const asyncLocalStorage = new AsyncLocalStorage()

function getStore() {
  const store = asyncLocalStorage.getStore()
  if (!store)
    throw new Error('current context is not in async hook')
  return store as { req: Request, res: Response }
}

export const reqContext = {
  get req() {
    return getStore().req
  },
  get res() {
    return getStore().res
  }
}

export default function () {
  server.use(async (req, res, next) => {
    asyncLocalStorage.run({ req, res }, next)
  })
}
export const order = -1000
