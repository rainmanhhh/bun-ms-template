const path = require('node:path')
const process = require('node:process')
const shell = require('shelljs')

const dir = process.argv[2]
if (!dir) {
  shell.echo('用法：bun genapi.js <目录名>')
  shell.exit(1)
}
const originDir = process.cwd()
shell.cd(path.dirname(__filename))
shell.rm('-rf', `${dir}/out`)
shell.exec(`npx openapi-generator-plus generate -c ${dir}/plus.yml`)
shell.cd(originDir) // 回到 openapi 目录
