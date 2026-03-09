import { defineConfig } from 'drizzle-kit'
import { appConfig } from '../src/config/appConfig'

export default defineConfig({
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: appConfig.db,
})
