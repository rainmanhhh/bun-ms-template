import { defineConfig } from 'drizzle-kit'
import { appConfig } from '../src/config/appConfig'

const dbUrl = appConfig.dbUrl ?? ''
console.log('dbUrl: ', dbUrl)

export default defineConfig({
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url: dbUrl,
  },
})
