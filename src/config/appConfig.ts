import type { IAppConfig } from './IAppConfig'
import * as fs from 'node:fs'
import process from 'node:process'
import yaml from 'yaml'

function loadConfig() {
  const env = process.env.NODE_ENV || 'dev'
  const configContent = fs.readFileSync(`./config/${env}.yml`, 'utf-8')
  return yaml.parse(configContent) as IAppConfig
}

export const appConfig = loadConfig()
