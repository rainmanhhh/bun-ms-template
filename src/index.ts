import modules from './generated/modules'

async function main() {
  console.log('modules: ', JSON.stringify(modules, null, 2))
  const server = Bun.serve({
    port: 3000,
    fetch(_req) {
      return new Response('Hello from Vite + Bun!')
    },
  })

  console.log(`Server is running on http://localhost:${server.port}`)
}

main().then()
