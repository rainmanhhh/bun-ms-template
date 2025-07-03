import type { IAppConfig } from './IAppConfig'
import * as fs from 'node:fs'
import yaml from 'yaml'

const configFiles: string[] = []

function readConfigFile(filePath: string) {
  if (fs.existsSync(filePath)) {
    const configContent = fs.readFileSync(filePath, 'utf-8')
    configFiles.push(filePath)
    return yaml.parse(configContent) as IAppConfig
  } else {
    return {} as IAppConfig
  }
}

function loadConfig() {
  const baseConfig = readConfigFile('./config/base.yml')
  const env = import.meta.env.NODE_ENV || 'development'
  const envConfig = readConfigFile(`./config/${env}.yml`)
  return Object.assign(baseConfig, envConfig, { env, configFiles })
}

export const appConfig = loadConfig()
