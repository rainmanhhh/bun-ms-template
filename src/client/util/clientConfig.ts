import {appConfig} from '~/config/appConfig.ts'
import {genServiceApiKey} from '~/client/util/genServiceApiKey.ts'

type FetchAPI = (url: string, init?: RequestInit) => Promise<Response>

export function clientConfig(serviceName: string) {
  return {
    baseUri: appConfig.gateway + serviceName,
    fetch: ((url, init = {}) => {
      init.headers = init.headers || {}
      const sak = genServiceApiKey()
      init.headers[sak.name] = sak.value
      return fetch(url, init)
    }) satisfies FetchAPI
  }
}
