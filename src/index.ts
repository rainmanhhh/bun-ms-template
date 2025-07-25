import * as process from 'node:process'
import { appConfig } from './config/appConfig.ts'
import modules from './generated/modules'
import { logger } from './logger.ts'

interface RunnableModule {
  name: string
  order: number
  exec: () => any
}
async function main() {
  logger.info('env: %s, loadedConfigFiles: %s', appConfig.env, JSON.stringify(appConfig.configFiles))
  const moduleEntries = Object.entries(modules as Record<string, any>)
  const runnableModules: RunnableModule[] = []
  for (const [moduleName, module] of moduleEntries) {
    const moduleDefaultExport = module.default
    if (typeof moduleDefaultExport === 'function') {
      runnableModules.push({
        name: moduleName,
        order: module.order || 0,
        exec: moduleDefaultExport
      })
    }
  }
  for (const module of runnableModules.sort((a, b) => a.order - b.order)) {
    try {
      await module.exec()
      logger.debug('run module [%s] success', module.name)
    } catch (e) {
      logger.error('run module [%s] failed', module.name, e)
      process.exit(1)
    }
  }
  logger.info('app started with %d modules', moduleEntries.length)
}

main().then()
