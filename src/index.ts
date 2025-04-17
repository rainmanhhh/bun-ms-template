import * as process from 'node:process'
import modules from './generated/modules'
import { logger } from './logger.ts'

async function main() {
  for (const [moduleName, module] of Object.entries(modules as Record<string, any>)) {
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
}

main().then()
