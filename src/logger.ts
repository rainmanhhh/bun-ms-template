import pino from 'pino'
import { appConfig } from './appConfig.ts'

export const logger = pino(appConfig.log)
