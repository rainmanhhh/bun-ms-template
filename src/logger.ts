import type { LoggerOptions } from 'winston'
import { createLogger, format, transports } from 'winston'
import { appConfig } from './config/appConfig'

import 'winston-daily-rotate-file'

const config = appConfig.log ?? {}

const logFormat = format.printf(({ level, message, timestamp, stack }) => {
  const text = `${timestamp} [${level}]: ${message}`
  return stack ? `${text}\n${stack}` : text
})

const transportArr: LoggerOptions['transports'] = []
if (appConfig.env === 'development' || appConfig.env === 'test') {
  config.console = config.console ?? true
  config.level = config.level ?? 'debug'
}
if (config.console) {
  transportArr.push(
    new transports.Console({
      format: format.combine(
        format.timestamp({ format: 'HH:mm:ss' }),
        format.colorize(),
        format.align(),
        format.splat(),
        format.errors({ stack: true }),
        logFormat,
      )
    })
  )
}
if (appConfig.env === 'production') {
  config.file = config.file ?? {}
  config.level = config.level ?? 'info'
}
if (config.file) {
  transportArr.push(
    new transports.DailyRotateFile({
      level: config.level,
      filename: `logs/${config.file.name || appConfig.name}-%DATE%.${config.file.suffix || 'log'}`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: config.file.maxSize || '128m',
      maxFiles: config.file.maxFiles || '30d',
      auditFile: '.log-rotate.json',
      createSymlink: true,
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.align(),
        format.splat(),
        format.errors({ stack: true }),
        logFormat,
      )
    })
  )
}

export const logger = createLogger({
  level: config.level,
  transports: transportArr
})
