import { writeFileSync } from 'node:fs'
import { glob } from 'glob'

function parseModules() {
  const files = glob.sync('src/modules/**/*.ts')
    .filter(file => !file.endsWith('.d.ts') && !file.endsWith('.test.ts')) // 排除类型定义文件和测试脚本
    .sort((a, b) => a.localeCompare(b))

  const moduleNames: string[] = []
  let output = ''

  for (const file of files) {
    const normalizedPath = file
      .replace(/\\/g, '/') // 统一路径分隔符为 `/`
      .replace(/^src\//, '') // 移除 `src/` 前缀
      .replace(/\.ts$/, '') // 移除 `.ts` 扩展名
    const moduleName = normalizedPath
      .replace(/^modules\//, '')
      .replace(/\//g, '_')
    moduleNames.push(moduleName)
    output += `import * as ${moduleName} from '../${normalizedPath}'\n`
  }

  output += `
export default {
  ${moduleNames.join(',\n  ')}
}
`

  // 2. 生成清单文件
  writeFileSync('src/generated/modules.ts', output)
}

parseModules()
