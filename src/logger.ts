import pino from 'pino'
import { appConfig } from './config/appConfig'

export const logger = pino(appConfig.log)
