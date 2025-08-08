import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import { appConfig } from '~/config/appConfig.ts'
import { logger } from '~/logger.ts'
import * as schema from '../../drizzle/schema.ts'

const dbUrl = appConfig.dbUrl

const poolConnection = mysql.createPool({
  uri: dbUrl ?? '',
})
export const db = drizzle(
  poolConnection,
  {
    schema,
    mode: 'planetscale'
  }
)
logger.info('drizzle instance created. dbUrl: %s', dbUrl)
