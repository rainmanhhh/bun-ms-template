import {appConfig} from '~/config/appConfig.ts'
import {createHash, randomBytes} from 'node:crypto'

const salt = randomBytes(16).toString('hex')

export function genServiceApiKey() {
  const secret = appConfig.sak?.value
  if (!secret)
    throw new Error('sak.value not configured')
  const hash = createHash('md5')
    .update(secret + salt)
    .digest('hex')
  return {
    name: appConfig.sak?.name || 'X-SAK',
    value: hash + salt,
  }
}
