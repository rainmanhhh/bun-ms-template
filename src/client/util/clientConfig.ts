import {appConfig} from '~/config/appConfig.ts'
import {genServiceApiKey} from '~/client/util/genServiceApiKey.ts'
import {getLogger} from '~/logger.ts'
const logger = getLogger('client.util.clientConfig')

type FetchAPI = (url: string, init?: RequestInit) => Promise<Response>

export function clientConfig(serviceName: string) {
  return {
    baseUri: appConfig.gateway + serviceName,
    fetch: ((url, init = {}) => {
      init.headers = new Headers(init.headers)
      const sak = genServiceApiKey()
      init.headers.set(sak.name, sak.value)
      logger.debug('fetch [%s], init: %o', url, init)
      return fetch(url, init)
    }) satisfies FetchAPI
  }
}
