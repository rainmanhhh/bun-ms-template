import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import { appConfig } from '~/config/appConfig.ts'
import { logger } from '~/logger.ts'
import * as relations from '../../drizzle/relations.ts'
import * as schema from '../../drizzle/schema.ts'

const dbConfig = appConfig.db

const poolConnection = mysql.createPool({
  ...dbConfig
})
export const db = drizzle(
  poolConnection,
  {
    schema: {
      ...schema,
      ...relations,
    },
    mode: dbConfig?.mode ?? 'default'
  }
)
if (dbConfig)
  logger.info('drizzle instance created.')
else
  logger.info('appConfig.db not set. drizzle instance unavailable')
