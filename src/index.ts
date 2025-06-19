import * as process from 'node:process'
import { appConfig } from './config/appConfig.ts'
import modules from './generated/modules'
import { logger } from './logger.ts'

async function main() {
  logger.info('env: %s', appConfig.env)
  const moduleEntries = Object.entries(modules as Record<string, any>)
  for (const [moduleName, module] of moduleEntries) {
    const moduleDefaultExport = module.default
    if (typeof moduleDefaultExport === 'function') {
      try {
        await moduleDefaultExport()
      } catch (e) {
        logger.error('load module [%s] failed', moduleName, e)
        process.exit(1)
      }
    }
    logger.debug('module [%s] loaded', moduleName)
  }
  logger.info('all modules loaded. total count: %d', moduleEntries.length)
}

main().then()
