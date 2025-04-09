import { server } from '../server.ts'

server.get('/', async (_ctx) => {
  return 'Hello World'
})
