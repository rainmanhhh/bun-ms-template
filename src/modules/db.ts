import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import { appConfig } from '~/config/appConfig.ts'
import { logger } from '~/logger.ts'
import * as schema from '../../drizzle/schema.ts'

const dbConfig = appConfig.db

const poolConnection = mysql.createPool({
  uri: dbConfig?.url ?? '',
})
export const db = drizzle(
  poolConnection,
  {
    schema,
    mode: dbConfig?.mode ?? 'default'
  }
)
logger.info('drizzle instance created.')
