import type { LoggerOptions } from 'pino'
import pino from 'pino'

export const loggerConfig: LoggerOptions = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
}

export const logger = pino(loggerConfig)
