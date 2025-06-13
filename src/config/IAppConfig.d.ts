import type { LoggerOptions } from 'pino'

export interface IAppConfig {
  server: {
    port: number
    failOnUnknownProperties?: boolean
  }
  log: LoggerOptions
}
