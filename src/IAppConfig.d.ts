import type { LoggerOptions } from 'pino'

export interface IAppConfig {
  port: number
  log: LoggerOptions
}
