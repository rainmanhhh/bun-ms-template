import type { Logger } from 'winston'
import type * as Transport from 'winston-transport'
import { createLogger, format, transports } from 'winston'

import { appConfig } from './config/appConfig'
import 'winston-daily-rotate-file'

const config = appConfig.log ?? {}

const logFormat = format.printf(({ level, message, timestamp, stack, namespace }) => {
  const prefix = namespace ? `[${namespace}]` : ''
  const text = `${timestamp} [${level}]${prefix}: ${message}`
  return stack ? `${text}\n${stack}` : text
})

// 开发/测试环境默认开启控制台日志
if (appConfig.env === 'development' || appConfig.env === 'test') {
  config.console = config.console ?? true
  config.level = config.level ?? 'debug'
}
// 生产环境默认开启文件日志
if (appConfig.env === 'production') {
  config.file = config.file ?? {}
  config.level = config.level ?? 'info'
}

export const logger = createModuleLogger('')

const loggerCache = new Map<string, Logger>()
export function getLogger(namespace: string): Logger {
  if (!loggerCache.has(namespace))
    loggerCache.set(namespace, createModuleLogger(namespace))
  return loggerCache.get(namespace)!
}

/**
 * 日志工厂函数
 * @param namespace
 */
function createModuleLogger(namespace: string): Logger {
  // 获取模块专属级别（无配置则使用全局级别）
  const level = config.levels?.[namespace] || config.level

  // 创建带命名空间的格式化器（注入模块名）
  const namespaceFormat = format((info) => {
    info.namespace = namespace
    return info
  })()

  // 创建模块专属 logger
  return createLogger({
    level,
    format: format.combine(namespaceFormat), // 注入模块名
    transports: createTransports(level)
  })
}

function createTransports(level: string): Transport[] {
  const transportArr: Transport[] = []

  // 控制台 transport
  if (config.console) {
    transportArr.push(
      new transports.Console({
        level,
        format: format.combine(
          format.timestamp({ format: 'HH:mm:ss' }),
          format.colorize(),
          format.align(),
          format.splat(),
          format.errors({ stack: true }),
          logFormat
        )
      })
    )
  }

  // 按日期轮转的文件 transport
  if (config.file) {
    transportArr.push(
      new transports.DailyRotateFile({
        level,
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
          logFormat
        )
      })
    )
  }

  return transportArr
}
